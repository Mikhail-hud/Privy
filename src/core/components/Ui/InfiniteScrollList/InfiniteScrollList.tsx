import List from "@mui/material/List";
import { FC, ReactElement, useRef, memo } from "react";
import { Spiner, VirtualizationProvider, VirtualizedItem } from "@app/core/components";

interface InfiniteScrollListProps<T> {
    data: T[];
    loader?: FC;
    isLoading: boolean;
    isFetching?: boolean;
    loaderCount?: number;
    fetchNextPage: () => void;
    isFetchingNextPage: boolean;
    hasNextPage: boolean | undefined;
    renderItem: (item: T, index: number) => ReactElement;
}

const InfiniteScrollListComponent = <T extends { id: number | string }>({
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
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loaderNodeRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!loaderNodeRef.current) return;
        if (data.length === 0) return;

        observerRef.current = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && hasNextPage && !isFetchingNextPage && !isLoading && !isFetching) {
                fetchNextPage();
            }
        });

        observerRef.current.observe(loaderNodeRef.current);

        return () => observerRef.current?.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching, data.length]);

    return (
        <VirtualizationProvider>
            <List sx={{ width: "100%", bgcolor: "transparent", padding: 0 }}>
                {isLoading && Loader
                    ? Array.from({ length: loaderCount }).map((_, index) => <Loader key={index} />)
                    : data.map((item, index) => (
                          <VirtualizedItem id={item.id} key={item.id}>
                              {renderItem(item, index)}
                          </VirtualizedItem>
                      ))}

                {(hasNextPage || isFetching) && !isLoading && <Spiner enableTrackSlot ref={loaderNodeRef} />}
            </List>
        </VirtualizationProvider>
    );
};

export const InfiniteScrollList = memo(InfiniteScrollListComponent) as <T extends object>(
    props: InfiniteScrollListProps<T>
) => ReactElement;
