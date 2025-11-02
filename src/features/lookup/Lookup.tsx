import { enqueueSnackbar } from "notistack";
import { useDebounce } from "@app/core/hooks";
import { UsersContext } from "@app/features";
import { useLoaderData } from "react-router-dom";
import { QueryError } from "@app/core/interfaces";
import { FC, useState, useCallback, ChangeEvent, ReactElement } from "react";
import { DEBOUNCE_DELAY, GENERIC_ERROR_MESSAGE } from "@app/core/constants/general";
import { UserListItem, UserListItemSkeleton } from "@app/features/lookup/components";
import { ContentCardContainer, InfiniteScrollList, UserSearchField } from "@app/core/components";
import { useFollowUserMutation, useGetUsersInfiniteQuery, User, useUnFollowUserMutation } from "@app/core/services";

export const Lookup: FC = () => {
    const { params } = useLoaderData() as UsersContext;
    const [searchQuery, setSearchQuery] = useState<string>("");
    const query: string = useDebounce(searchQuery, DEBOUNCE_DELAY);

    const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, isFetching } = useGetUsersInfiniteQuery({
        ...params,
        query,
    });

    const [follow] = useFollowUserMutation();
    const [unFollow] = useUnFollowUserMutation();

    const users: User[] = useMemo<User[]>(() => data?.pages.flatMap(page => page.data) ?? [], [data]);

    const onSearchQueryChange = (event: ChangeEvent<HTMLInputElement>): void => setSearchQuery(event.target.value);

    const handleFollow = useCallback(
        async (userName: string): Promise<void> => {
            try {
                await follow({ userName }).unwrap();
            } catch (error) {
                const errorMessage: string = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
                enqueueSnackbar(errorMessage, { variant: "error" });
            }
        },
        [follow]
    );

    const handleUnfollow = useCallback(
        async (userName: string): Promise<void> => {
            try {
                await unFollow({ userName }).unwrap();
            } catch (error) {
                const errorMessage: string = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
                enqueueSnackbar(errorMessage, { variant: "error" });
            }
        },
        [unFollow]
    );

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
                    <UserListItem
                        user={user}
                        key={user.id}
                        onFollow={handleFollow}
                        onUnfollow={handleUnfollow}
                        isLast={index === users.length - 1}
                    />
                )}
            />
        </ContentCardContainer>
    );
};
