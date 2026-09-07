import { useEffect, useMemo, useRef, useState } from "react";
import { InfiniteData, QueryKey, useQuery } from "@tanstack/react-query";
import { INITIAL_PAGE_PARAM } from "@app/core/constants/ParamsConstants.ts";
import { FEED_POLL_INTERVAL, PROCESSING_POLL_INTERVAL } from "@app/core/constants/general.ts";
import { isMediaProcessing } from "@app/core/utils/threadMedia.ts";
import {
    queryClient,
    QueryParams,
    Thread,
    ThreadListResponse,
    ThreadMedia,
    ThreadPageFetcher,
    THREADS_KEYS,
} from "@app/core/services";

interface UseLiveThreadPageParams<TParams extends QueryParams> {
    /** Cache key of the infinite feed to keep live. */
    queryKey: QueryKey;
    /** Its params, minus `page` — the hook supplies the page it is watching. */
    params: TParams;
    /** The endpoint behind that feed. Pass the `threadsApi` method itself, so the identity is stable. */
    fetchPage: ThreadPageFetcher<TParams>;
    /** The feed's cached pages, straight from `useInfiniteQuery`. */
    data: InfiniteData<ThreadListResponse> | undefined;
}

/**
 * Keeps the feed page the user is currently looking at live: likes, reply counts, edits and finished
 * video transcodes appear on their own, without a reload and without re-reading the other pages.
 *
 * Exactly one page is polled — the one on screen, tracked through an `IntersectionObserver` over the
 * rendered threads — so the request count stays at one per interval however far the user has scrolled,
 * and scrolling back up moves the polling with them instead of leaving it on the deepest page.
 *
 * The answer is merged into cached threads **by id**, never used as a replacement window. That
 * distinction is what makes polling an offset-paginated feed safe: `skip = (page - 1) * limit`, so
 * once threads have been posted the same `page` returns a shifted slice. Swapping the slice in would
 * duplicate rows the user already saw and drop others, whereas merging by id updates the rows that are
 * still there and ignores the rest. No row is ever added, removed or reordered here.
 */
export const useLiveThreadPage = <TParams extends QueryParams>({
    queryKey,
    params,
    fetchPage,
    data,
}: UseLiveThreadPageParams<TParams>): void => {
    const page: number = useVisibleFeedPage(data);

    const isAwaitingTranscode: boolean = !!data?.pages.some((cachedPage: ThreadListResponse): boolean =>
        cachedPage.data.some((thread: Thread): boolean => thread.media.some(isMediaProcessing))
    );

    const { data: freshPage } = useQuery({
        queryKey: THREADS_KEYS.livePage(queryKey, page),
        queryFn: (): Promise<ThreadListResponse> => fetchPage({ ...params, page }),
        enabled: !!data,
        initialData: (): ThreadListResponse | undefined => findCachedPage(data, page),
        initialDataUpdatedAt: (): number => Date.now(),
        refetchInterval: isAwaitingTranscode ? PROCESSING_POLL_INTERVAL : FEED_POLL_INTERVAL,
        gcTime: 0,
    });

    useEffect((): void => {
        if (freshPage) mergeThreadsIntoFeed(queryKey, freshPage.data);
    }, [freshPage, queryKey]);
};

/**
 * Which page of the feed is on screen right now, by watching the rendered thread nodes.
 *
 * The list is flattened before it is rendered, so page membership is not visible in the DOM — it is
 * recovered by mapping each visible `data-item-id` back through the cached pages. Rows belonging to
 * some other list are absent from that map and therefore ignored, which is what keeps the
 * document-wide query safe.
 *
 * Those ids sit on `VirtualizedItem`'s wrapper rather than on the thread itself, because the feed is
 * virtualized: a row's contents are unmounted once it scrolls out of range, and an observer bound to
 * them would lose every node the user scrolled past and see nothing when they came back.
 *
 * @returns The page with the most threads in view, or the last loaded page while nothing is in view
 *          (feed scrolled past, or not yet rendered).
 */
const useVisibleFeedPage = (data: InfiniteData<ThreadListResponse> | undefined): number => {
    const lastLoadedPage: number = (data?.pageParams.at(-1) as number | undefined) ?? INITIAL_PAGE_PARAM;
    const [visiblePage, setVisiblePage] = useState<number | undefined>(undefined);

    const pageByThreadId: Map<string, number> = useMemo((): Map<string, number> => {
        const byId = new Map<string, number>();

        data?.pages.forEach((cachedPage: ThreadListResponse, index: number): void => {
            const pageNumber: number = (data.pageParams[index] as number | undefined) ?? INITIAL_PAGE_PARAM;

            cachedPage.data.forEach((thread: Thread): void => {
                byId.set(thread.id, pageNumber);
            });
        });

        return byId;
    }, [data]);

    const pageByThreadIdRef = useRef<Map<string, number>>(pageByThreadId);
    pageByThreadIdRef.current = pageByThreadId;

    const renderedThreads: string = useMemo(
        (): string =>
            Array.from(pageByThreadId, ([id, pageNumber]: [string, number]): string => `${id}:${pageNumber}`).join(),
        [pageByThreadId]
    );

    useEffect((): (() => void) | undefined => {
        const nodes: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>("[data-item-id]");

        if (nodes.length === 0) return undefined;

        const inView = new Set<string>();

        const observer = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]): void => {
                entries.forEach((entry: IntersectionObserverEntry): void => {
                    const threadId: string | undefined = (entry.target as HTMLElement).dataset.itemId;

                    if (!threadId) return;
                    if (entry.isIntersecting && entry.intersectionRect.height > 0) inView.add(threadId);
                    else inView.delete(threadId);
                });

                setVisiblePage(pickDominantPage(inView, pageByThreadIdRef.current));
            },
            { threshold: [0, 0.25, 0.5, 0.75, 1] }
        );

        nodes.forEach((node: HTMLElement): void => observer.observe(node));

        return (): void => observer.disconnect();
    }, [renderedThreads]);

    return visiblePage ?? lastLoadedPage;
};

const pickDominantPage = (inView: Set<string>, pageByThreadId: Map<string, number>): number | undefined => {
    const countByPage = new Map<number, number>();

    inView.forEach((threadId: string): void => {
        const pageNumber: number | undefined = pageByThreadId.get(threadId);

        if (pageNumber === undefined) return;

        countByPage.set(pageNumber, (countByPage.get(pageNumber) ?? 0) + 1);
    });

    let dominant: number | undefined;
    let best = 0;

    countByPage.forEach((count: number, pageNumber: number): void => {
        if (count > best || (count === best && dominant !== undefined && pageNumber < dominant)) {
            dominant = pageNumber;
            best = count;
        }
    });

    return dominant;
};

/** The feed's own copy of one page, used to seed the poll so it does not refetch what is already here. */
const findCachedPage = (
    data: InfiniteData<ThreadListResponse> | undefined,
    page: number
): ThreadListResponse | undefined => {
    const index: number = data?.pageParams.findIndex((pageParam: unknown): boolean => pageParam === page) ?? -1;

    return index === -1 ? undefined : data?.pages[index];
};

/**
 * Copies the live fields of `fresh` onto the matching cached threads.
 *
 * Returns the previous cache object untouched when nothing actually differs, so an unchanged poll
 * notifies no subscriber. Without that guard every interval would hand React a new object for the
 * whole feed and re-render it — which is exactly the flicker this replaced.
 */
const mergeThreadsIntoFeed = (queryKey: QueryKey, fresh: Thread[]): void => {
    const byId = new Map<string, Thread>(fresh.map((thread: Thread): [string, Thread] => [thread.id, thread]));

    queryClient.setQueryData<InfiniteData<ThreadListResponse>>(queryKey, oldData => {
        if (!oldData?.pages) return oldData;

        let changed = false;

        const pages: ThreadListResponse[] = oldData.pages.map(
            (page: ThreadListResponse): ThreadListResponse => ({
                ...page,
                data: page.data.map((cached: Thread): Thread => {
                    const polled: Thread | undefined = byId.get(cached.id);

                    if (!polled || !hasThreadChanged(cached, polled)) return cached;

                    changed = true;

                    return polled;
                }),
            })
        );

        return changed ? { ...oldData, pages } : oldData;
    });
};

/**
 * Whether a polled thread differs from the cached one in a way the UI shows.
 *
 * Compared field by field rather than deep-equal: the response carries timestamps and author details
 * that are stable, and a deep comparison of every page on every interval is work for nothing. Media
 * needs only `status` and `src` — poster, blurhash and real dimensions are written by the same update
 * that sets them.
 */
const hasThreadChanged = (cached: Thread, polled: Thread): boolean =>
    polled.likeCount !== cached.likeCount ||
    polled.replyCount !== cached.replyCount ||
    polled.isLikedByCurrentUser !== cached.isLikedByCurrentUser ||
    polled.content !== cached.content ||
    hasMediaChanged(cached.media, polled.media);

const hasMediaChanged = (cached: ThreadMedia[], polled: ThreadMedia[]): boolean =>
    cached.length !== polled.length ||
    polled.some(
        (media: ThreadMedia, index: number): boolean =>
            media.status !== cached[index].status || media.src !== cached[index].src
    );
