import { FC, useMemo } from "react";
import { useLoaderData } from "react-router-dom";
import { EmptyThreadFallback, ThreadFeed } from "@app/features/talkSpace/components";
import { useLiveThreadPage } from "@app/core/hooks";
import {
    Thread,
    ThreadListResponse,
    THREADS_KEYS,
    threadsApi,
    useGetUserThreadsInfiniteQuery,
} from "@app/core/services";
import { UserProfileThreadsContext } from "@app/features/userProfile/UserProfileCard/UserProfileTabs/loaders";

export const UserThreads: FC = () => {
    const { params } = useLoaderData() as UserProfileThreadsContext;
    const { data, fetchNextPage, hasNextPage, isLoading, isFetching, isFetchingNextPage } =
        useGetUserThreadsInfiniteQuery(params);

    const threads: Thread[] = useMemo<Thread[]>(
        (): Thread[] => data?.pages.flatMap((page: ThreadListResponse): Thread[] => page.data) ?? [],
        [data]
    );

    const feedKey = useMemo(() => THREADS_KEYS.userList(params), [params]);

    useLiveThreadPage({ data, params, fetchPage: threadsApi.getUserThreads, queryKey: feedKey });

    const showEmptyFallback: boolean = !isLoading && threads.length === 0;

    return (
        <ThreadFeed
            threads={threads}
            isLoading={isLoading}
            isFetching={isFetching}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            showEmptyFallback={showEmptyFallback}
            isFetchingNextPage={isFetchingNextPage}
            emptyFallback={<EmptyThreadFallback isOwner={false} />}
        />
    );
};
