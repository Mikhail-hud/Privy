import { FC, useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { ThreadDialogForm } from "@app/core/components";
import { EmptyThreadFallback, ThreadFeed } from "@app/features/talkSpace/components";
import { ProfileThreadsContext } from "@app/features/profile/ProfileCard/ProfileTabs/loaders";
import { Thread, ThreadListResponse, useGetProfileThreadsInfiniteQuery } from "@app/core/services";

export const ProfileThreads: FC = () => {
    const { params } = useLoaderData() as ProfileThreadsContext;
    const { data, fetchNextPage, hasNextPage, isLoading, isFetching, isFetchingNextPage } =
        useGetProfileThreadsInfiniteQuery(params);

    const threads: Thread[] = useMemo<Thread[]>(
        (): Thread[] => data?.pages.flatMap((page: ThreadListResponse): Thread[] => page.data) ?? [],
        [data]
    );

    const showEmptyFallback: boolean = !isLoading && threads.length === 0;
    const [open, setOpen] = useState<boolean>(false);
    const handleOpenTreadForm = (): void => setOpen(true);

    return (
        <>
            <ThreadFeed
                isOwner
                threads={threads}
                isLoading={isLoading}
                isFetching={isFetching}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
                showEmptyFallback={showEmptyFallback}
                onCreateThread={handleOpenTreadForm}
                isFetchingNextPage={isFetchingNextPage}
                emptyFallback={<EmptyThreadFallback isOwner onCreateThread={handleOpenTreadForm} />}
            />
            <ThreadDialogForm open={open} setOpen={setOpen} />
        </>
    );
};
