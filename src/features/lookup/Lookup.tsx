import { useDebounce } from "@app/core/hooks";
import { UsersContext } from "@app/features";
import { useLoaderData } from "react-router-dom";
import { DEBOUNCE_DELAY } from "@app/core/constants/general";
import { FC, useState, ChangeEvent, ReactElement } from "react";
import { useGetUsersInfiniteQuery, User } from "@app/core/services";
import { UserListItem, UserListItemSkeleton } from "@app/features/lookup/components";
import { ContentCardContainer, InfiniteScrollList, UserSearchField } from "@app/core/components";

export const Lookup: FC = () => {
    const { params } = useLoaderData() as UsersContext;
    const [searchQuery, setSearchQuery] = useState<string>("");
    const query: string = useDebounce(searchQuery, DEBOUNCE_DELAY);

    const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, isFetching } = useGetUsersInfiniteQuery({
        ...params,
        query,
    });

    const users: User[] = useMemo<User[]>(() => data?.pages.flatMap(page => page.data) ?? [], [data]);

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
            <InfiniteScrollList<User>
                data={users}
                loaderCount={10}
                isLoading={isLoading}
                isFetching={isFetching}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
                loader={UserListItemSkeleton}
                isFetchingNextPage={isFetchingNextPage}
                renderItem={(user: User, index: number): ReactElement => (
                    <UserListItem user={user} key={user.id} isLast={index === users.length - 1} />
                )}
            />
        </ContentCardContainer>
    );
};
