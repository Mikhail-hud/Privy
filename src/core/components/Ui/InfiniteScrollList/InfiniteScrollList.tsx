import List from "@mui/material/List";
import { Spiner } from "@app/core/components";
import { FC, ReactElement, useRef, useCallback, memo } from "react";

interface InfiniteScrollListProps<T> {
    data: T[];
    loader?: FC;
    isLoading: boolean;
    isFetching: boolean;
    loaderCount?: number;
    fetchNextPage: () => void;
    isFetchingNextPage: boolean;
    hasNextPage: boolean | undefined;
    renderItem: (item: T, index: number) => ReactElement;
}

const InfiniteScrollListComponent = <T extends object>({
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
    renderItem,
    loader: Loader,
    loaderCount = 1,
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
        <List sx={{ width: "100%", bgcolor: "transparent" }}>
            {isLoading && Loader
                ? Array.from({ length: loaderCount }).map((_, index) => <Loader key={index} />)
                : data.map((item, index) => renderItem(item, index))}

            {(hasNextPage || isFetching) && !isLoading && <Spiner enableTrackSlot ref={loaderRef} />}
        </List>
    );
};

export const InfiniteScrollList = memo(InfiniteScrollListComponent) as <T extends object>(
    props: InfiniteScrollListProps<T>
) => ReactElement;
