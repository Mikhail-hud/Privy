import List from "@mui/material/List";
import { FC, ReactElement, memo } from "react";
import { useInfiniteScrollTrigger } from "@app/core/hooks";
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
    const loaderNodeRef = useInfiniteScrollTrigger({
        isLoading,
        isFetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        enabled: !!data.length,
    });

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
