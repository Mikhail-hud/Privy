import { useDebounce } from "@app/core/hooks";
import { useLoaderData } from "react-router-dom";
import { FC, useState, ChangeEvent, useMemo } from "react";
import { DEBOUNCE_DELAY } from "@app/core/constants/general";
import { ThreadFeed } from "@app/features/talkSpace/components";
import { ThreadsContext } from "@app/features/talkSpace/loaders";
import { ContentCardContainer, UserSearchField } from "@app/core/components";
import { Thread, ThreadListResponse, useGetThreadsInfiniteQuery } from "@app/core/services";

export const TalkSpace: FC = () => {
    const { params } = useLoaderData() as ThreadsContext;
    const [searchQuery, setSearchQuery] = useState<string>("");
    const query: string = useDebounce(searchQuery, DEBOUNCE_DELAY);
    const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, isFetching } = useGetThreadsInfiniteQuery({
        ...params,
        query,
    });

    const threads: Thread[] = useMemo<Thread[]>(
        (): Thread[] => data?.pages.flatMap((page: ThreadListResponse): Thread[] => page.data) ?? [],
        [data]
    );

    const onSearchQueryChange = (event: ChangeEvent<HTMLInputElement>): void => setSearchQuery(event.target.value);

    return (
        <ContentCardContainer
            sx={theme => ({
                minHeight: "100vh",
                padding: theme.spacing(3),
                [theme.breakpoints.down("sm")]: {
                    padding: theme.spacing(1.5, 2),
                },
            })}
        >
            <ThreadFeed
                threads={threads}
                isLoading={isLoading}
                isFetching={isFetching}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                header={<UserSearchField value={searchQuery} onChange={onSearchQueryChange} />}
            />
        </ContentCardContainer>
    );
};
