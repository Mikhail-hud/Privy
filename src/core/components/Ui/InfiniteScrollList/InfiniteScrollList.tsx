import List from "@mui/material/List";
import { Spiner } from "@app/core/components";
import { FC, ReactElement, useRef, useCallback, memo } from "react";

interface InfiniteScrollListProps<T> {
    data: T[];
    isLoading: boolean;
    isFetching: boolean;
    renderSkeleton: FC;
    skeletonCount?: number;
    fetchNextPage: () => void;
    isFetchingNextPage: boolean;
    hasNextPage: boolean | undefined;
    renderItem: (item: T) => ReactElement;
}

const InfiniteScrollListComponent = <T extends object>({
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
    renderItem,
    renderSkeleton: SkeletonComponent,
    skeletonCount = 5,
}: InfiniteScrollListProps<T>): ReactElement => {
    const observer = useRef<IntersectionObserver | null>(null);

    const loaderRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage && !isLoading && !isFetching) {
                    fetchNextPage();
                }
            });

            if (node) observer.current.observe(node);
        },

        [hasNextPage, isFetchingNextPage, isLoading, isFetching, fetchNextPage]
    );
    return (
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {isLoading
                ? Array.from({ length: skeletonCount }).map((_, index) => <SkeletonComponent key={index} />)
                : data.map(item => renderItem(item))}

            {(hasNextPage || isFetching) && !isLoading && <Spiner enableTrackSlot ref={loaderRef} />}
        </List>
    );
};

export const InfiniteScrollList = memo(InfiniteScrollListComponent) as <T extends object>(
    props: InfiniteScrollListProps<T>
) => ReactElement;
