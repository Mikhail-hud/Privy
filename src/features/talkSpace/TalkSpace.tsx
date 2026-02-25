import { useDebounce } from "@app/core/hooks";
import { useLoaderData } from "react-router-dom";
import { DEBOUNCE_DELAY } from "@app/core/constants/general";
import { ThreadsContext } from "@app/features/talkSpace/loaders";
import { FC, useState, ChangeEvent, ReactElement, useCallback, useMemo } from "react";
import { ContentCardContainer, InfiniteScrollList, UserSearchField } from "@app/core/components";
import { Thread, ThreadListResponse, ThreadMedia, useGetThreadsInfiniteQuery } from "@app/core/services";
import { ThreadListItem, ThreadListItemSkeleton, VideoFeedProvider } from "@app/features/talkSpace/components";
import { ThreadMediaBackdrop } from "@app/features/talkSpace/components/ThreadMediaGallery/ThreadMediaBackdrop";
import { ThreadMediaGalleryBackdrop } from "@app/features/talkSpace/components/ThreadMediaGallery/ThreadMediaGalleryBackdrop";

export const TalkSpace: FC = () => {
    const { params } = useLoaderData() as ThreadsContext;
    const [searchQuery, setSearchQuery] = useState<string>("");
    const query: string = useDebounce(searchQuery, DEBOUNCE_DELAY);
    const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, isFetching } = useGetThreadsInfiniteQuery({
        ...params,
        query,
    });

    const [mediaGalleryState, setMediaGalleryState] = useState<{
        isOpen: boolean;
        media: ThreadMedia[];
        initialSlide: number;
        initialTime: number;
    }>({
        isOpen: false,
        media: [],
        initialSlide: 0,
        initialTime: 0,
    });

    const [threadMediaState, setThreadMediaState] = useState<{
        media: ThreadMedia | null;
        open: boolean;
        initialTime: number;
    }>({
        media: null,
        open: false,
        initialTime: 0,
    });

    const handleOpenThreadMediaGalleryBackdrop = useCallback(
        (media: ThreadMedia[], index: number, initialTime: number): void => {
            setMediaGalleryState({ isOpen: true, media, initialSlide: index, initialTime: initialTime ?? 0 });
        },
        []
    );
    const handleCloseMediaGalleryBackdrop = useCallback((): void => {
        setMediaGalleryState({ media: [], isOpen: false, initialSlide: 0, initialTime: 0 });
    }, []);

    const handleOpenThreadMediaBackdrop = useCallback((media: ThreadMedia, initialTime: number): void => {
        setThreadMediaState({ media, open: true, initialTime: initialTime ?? 0 });
    }, []);

    const handleCloseThreadMediaBackdrop = useCallback((): void => {
        setThreadMediaState({ media: null, open: false, initialTime: 0 });
    }, []);

    const threads: Thread[] = useMemo<Thread[]>(
        (): Thread[] => data?.pages.flatMap((page: ThreadListResponse): Thread[] => page.data) ?? [],
        [data]
    );

    const onSearchQueryChange = (event: ChangeEvent<HTMLInputElement>): void => setSearchQuery(event.target.value);

    return (
        <VideoFeedProvider>
            <ContentCardContainer
                sx={theme => ({
                    minHeight: "100vh",
                    padding: theme.spacing(3),
                    [theme.breakpoints.down("sm")]: {
                        padding: theme.spacing(1.5, 2),
                    },
                })}
            >
                <UserSearchField value={searchQuery} onChange={onSearchQueryChange} />
                <InfiniteScrollList<Thread>
                    data={threads}
                    loaderCount={10}
                    isLoading={isLoading}
                    isFetching={isFetching}
                    hasNextPage={hasNextPage}
                    fetchNextPage={fetchNextPage}
                    loader={ThreadListItemSkeleton}
                    isFetchingNextPage={isFetchingNextPage}
                    renderItem={(thread: Thread, index: number): ReactElement => (
                        <ThreadListItem
                            thread={thread}
                            key={thread.id}
                            isLast={index === threads.length - 1}
                            handleOpenThreadMediaBackdrop={handleOpenThreadMediaBackdrop}
                            handleOpenThreadMediaGalleryBackdrop={handleOpenThreadMediaGalleryBackdrop}
                        />
                    )}
                />
            </ContentCardContainer>
            <ThreadMediaGalleryBackdrop
                open={mediaGalleryState.isOpen}
                media={mediaGalleryState.media}
                onClose={handleCloseMediaGalleryBackdrop}
                initialSlide={mediaGalleryState.initialSlide}
                initialTime={mediaGalleryState.initialTime}
            />
            <ThreadMediaBackdrop
                open={threadMediaState.open}
                media={threadMediaState.media}
                onClose={handleCloseThreadMediaBackdrop}
                initialTime={threadMediaState.initialTime}
            />
        </VideoFeedProvider>
    );
};
