import { Thread, ThreadMedia } from "@app/core/services";
import { InfiniteScrollList } from "@app/core/components";
import { FC, ReactElement, ReactNode, useCallback, useState } from "react";
import { ThreadListItem, ThreadListItemSkeleton, useVideoFeed } from "@app/features/talkSpace/components";
import { ThreadMediaBackdrop } from "@app/features/talkSpace/components/ThreadMediaGallery/ThreadMediaBackdrop";
import { ThreadMediaGalleryBackdrop } from "@app/features/talkSpace/components/ThreadMediaGallery/ThreadMediaGalleryBackdrop";

interface ThreadFeedProps {
    threads: Thread[];
    isOwner?: boolean;
    isLoading: boolean;
    isFetching: boolean;
    isFetchingNextPage: boolean;
    hasNextPage: boolean | undefined;
    fetchNextPage: () => void;
    header?: ReactNode;
    showEmptyFallback?: boolean;
    emptyFallback?: ReactNode;
    loaderCount?: number;
    onCreateThread?: () => void;
}

export const ThreadFeed: FC<ThreadFeedProps> = ({
    threads,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    header,
    emptyFallback,
    loaderCount = 10,
    showEmptyFallback,
}) => {
    const { setGlobalPause } = useVideoFeed();

    const [mediaGalleryState, setMediaGalleryState] = useState<{
        isOpen: boolean;
        media: ThreadMedia[];
        initialSlide: number;
    }>({
        isOpen: false,
        media: [],
        initialSlide: 0,
    });

    const [threadMediaState, setThreadMediaState] = useState<{
        media: ThreadMedia | null;
        open: boolean;
    }>({
        media: null,
        open: false,
    });

    const handleOpenThreadMediaGalleryBackdrop = useCallback(
        (media: ThreadMedia[], index: number): void => {
            const activeMedia: ThreadMedia = media[index];
            setGlobalPause(true, activeMedia?.id);
            setMediaGalleryState({ isOpen: true, media, initialSlide: index });
        },
        [setGlobalPause]
    );

    const handleCloseMediaGalleryBackdrop = useCallback((): void => {
        setGlobalPause(false);
        setMediaGalleryState({ media: [], isOpen: false, initialSlide: 0 });
    }, [setGlobalPause]);

    const handleOpenThreadMediaBackdrop = useCallback(
        (media: ThreadMedia): void => {
            setGlobalPause(true, media?.id);
            setThreadMediaState({ media, open: true });
        },
        [setGlobalPause]
    );

    const handleCloseThreadMediaBackdrop = useCallback((): void => {
        setGlobalPause(false);
        setThreadMediaState({ media: null, open: false });
    }, [setGlobalPause]);

    return (
        <>
            {header}
            {showEmptyFallback ? (
                emptyFallback
            ) : (
                <InfiniteScrollList<Thread>
                    data={threads}
                    isLoading={isLoading}
                    isFetching={isFetching}
                    hasNextPage={hasNextPage}
                    loaderCount={loaderCount}
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
            )}
            <ThreadMediaGalleryBackdrop
                open={mediaGalleryState.isOpen}
                media={mediaGalleryState.media}
                onClose={handleCloseMediaGalleryBackdrop}
                initialSlide={mediaGalleryState.initialSlide}
            />
            <ThreadMediaBackdrop
                open={threadMediaState.open}
                media={threadMediaState.media}
                onClose={handleCloseThreadMediaBackdrop}
            />
        </>
    );
};
