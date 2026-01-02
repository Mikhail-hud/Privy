import { useDebounce } from "@app/core/hooks";
import { DEBOUNCE_DELAY } from "@app/core/constants/general";
import { FC, useState, ChangeEvent, ReactElement } from "react";
import { Thread, useGetThreadsInfiniteQuery } from "@app/core/services";
import { ThreadListItemSkeleton, ThreadListItem } from "@app/features/talkSpace/components";
import { ContentCardContainer, InfiniteScrollList, UserSearchField } from "@app/core/components";

export const TalkSpace: FC = () => {
    // const { params } = useLoaderData() as UsersContext;
    const [searchQuery, setSearchQuery] = useState<string>("");
    const query: string = useDebounce(searchQuery, DEBOUNCE_DELAY);
    const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, isFetching } = useGetThreadsInfiniteQuery({
        page: 1,
        query,
    });

    const threads: Thread[] = useMemo<Thread[]>(() => data?.pages.flatMap(page => page.data) ?? [], [data]);

    const onSearchQueryChange = (event: ChangeEvent<HTMLInputElement>): void => setSearchQuery(event.target.value);

    return (
        <ContentCardContainer
            sx={theme => ({
                padding: theme.spacing(3),
                [theme.breakpoints.down("sm")]: {
                    padding: theme.spacing(1.5, 2),
                },
            })}
        >
            <UserSearchField value={searchQuery} onChange={onSearchQueryChange} />
            <InfiniteScrollList<Thread>
                data={threads}
                loaderCount={10}
                isLoading={isLoading}
                isFetching={isFetching}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
                loader={ThreadListItemSkeleton}
                isFetchingNextPage={isFetchingNextPage}
                renderItem={(thread: Thread, index: number): ReactElement => (
                    <ThreadListItem thread={thread} key={thread.id} isLast={index === threads.length - 1} />
                )}
            />
        </ContentCardContainer>
    );
};
