import { FC, RefObject, useEffect, useRef } from "react";
import { Spiner } from "@app/core/components";

interface InfiniteLoaderProps {
    fetchNextPage: () => void;
    isFetching: boolean;
    hasNextPage: boolean;
}
export const InfiniteLoader: FC<InfiniteLoaderProps> = ({ fetchNextPage, isFetching, hasNextPage }) => {
    const hasTriggered: RefObject<boolean> = useRef(false);

    useEffect((): void => {
        if (!hasNextPage || isFetching || hasTriggered.current) {
            return;
        }
        hasTriggered.current = true;
        fetchNextPage();
    }, [isFetching, fetchNextPage, hasNextPage]);

    return <Spiner enableTrackSlot />;
};
