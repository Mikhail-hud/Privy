import { RefObject, useEffect, useRef } from "react";

interface UseInfiniteScrollTriggerParams {
    enabled?: boolean;
    isLoading: boolean;
    isFetching?: boolean;
    fetchNextPage?: () => void;
    isFetchingNextPage: boolean;
    hasNextPage: boolean | undefined;
}

export const useInfiniteScrollTrigger = ({
    enabled = true,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
}: UseInfiniteScrollTriggerParams): RefObject<HTMLDivElement | null> => {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loaderNodeRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!loaderNodeRef.current) return;
        if (!enabled) return;

        observerRef.current = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && hasNextPage && !isFetchingNextPage && !isLoading && !isFetching) {
                fetchNextPage?.();
            }
        });

        observerRef.current.observe(loaderNodeRef.current);

        return () => observerRef.current?.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching, enabled]);

    return loaderNodeRef;
};
