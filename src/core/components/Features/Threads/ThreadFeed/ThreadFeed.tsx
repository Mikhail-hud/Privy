import { Thread } from "@app/core/services";
import { FC, ReactElement, ReactNode } from "react";
import { InfiniteScrollList, ThreadListItem, ThreadListItemSkeleton, useMediaBackdrops } from "@app/core/components";

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
    const { handleOpenThreadMediaBackdrop, handleOpenThreadMediaGalleryBackdrop, backdrops } = useMediaBackdrops();

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
            {backdrops}
        </>
    );
};
