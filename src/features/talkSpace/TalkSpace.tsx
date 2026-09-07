import { useLoaderData } from "react-router-dom";
import { QueryKey } from "@tanstack/react-query";
import { FC, useState, ChangeEvent, useMemo } from "react";
import { DEBOUNCE_DELAY } from "@app/core/constants/general";
import { useDebounce, useLiveThreadPage } from "@app/core/hooks";
import { ThreadsContext } from "@app/features/talkSpace/loaders";
import { ContentCardContainer, ThreadFeed, UserSearchField } from "@app/core/components";
import { Thread, ThreadListResponse, THREADS_KEYS, threadsApi, useGetThreadsInfiniteQuery } from "@app/core/services";

export const TalkSpace: FC = () => {
    const { params } = useLoaderData() as ThreadsContext;
    const [searchQuery, setSearchQuery] = useState<string>("");
    const query: string = useDebounce(searchQuery, DEBOUNCE_DELAY);
    const feedParams = useMemo(() => ({ ...params, query }), [params, query]);
    const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, isFetching } =
        useGetThreadsInfiniteQuery(feedParams);

    const threads: Thread[] = useMemo<Thread[]>((): Thread[] => {
        const flat: Thread[] = data?.pages.flatMap((page: ThreadListResponse): Thread[] => page.data) ?? [];
        return Array.from(new Map(flat.map((thread: Thread): [string, Thread] => [thread.id, thread])).values());
    }, [data]);

    const feedKey: QueryKey = useMemo(() => THREADS_KEYS.list(feedParams), [feedParams]);

    useLiveThreadPage({ data, params: feedParams, fetchPage: threadsApi.getThreads, queryKey: feedKey });

    const onSearchQueryChange = (event: ChangeEvent<HTMLInputElement>): void => setSearchQuery(event.target.value);

    return (
        <ContentCardContainer
            sx={theme => ({
                minHeight: "100vh",
                padding: theme.spacing(3),
                [theme.breakpoints.down("sm")]: {
                    padding: theme.spacing(1.5, 2),
                },
            })}
        >
            <ThreadFeed
                threads={threads}
                isLoading={isLoading}
                isFetching={isFetching}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                header={<UserSearchField value={searchQuery} onChange={onSearchQueryChange} />}
            />
        </ContentCardContainer>
    );
};
