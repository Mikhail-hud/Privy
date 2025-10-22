import { enqueueSnackbar } from "notistack";
import { useDebounce } from "@app/core/hooks";
import { UsersContext } from "@app/features";
import TextField from "@mui/material/TextField";
import { useLoaderData } from "react-router-dom";
import { QueryError } from "@app/core/interfaces";
import { FC, useState, useCallback, ChangeEvent, ReactElement } from "react";
import { DEBOUNCE_DELAY, GENERIC_ERROR_MESSAGE } from "@app/core/constants/general";
import { ContentCardContainer, InfiniteScrollList, UserListItem, UserListItemSkeleton } from "@app/core/components";
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
        async (id: number): Promise<void> => {
            try {
                await follow({ id }).unwrap();
            } catch (error) {
                const errorMessage: string = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
                enqueueSnackbar(errorMessage, { variant: "error" });
            }
        },
        [follow]
    );

    const handleUnfollow = useCallback(
        async (id: number): Promise<void> => {
            try {
                await unFollow({ id }).unwrap();
            } catch (error) {
                const errorMessage: string = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
                enqueueSnackbar(errorMessage, { variant: "error" });
            }
        },
        [unFollow]
    );

    return (
        <ContentCardContainer>
            <TextField
                fullWidth
                sx={{ p: 2 }}
                variant="outlined"
                value={searchQuery}
                onChange={onSearchQueryChange}
                placeholder="Start typing to search users..."
            />

            <InfiniteScrollList<User>
                data={users}
                skeletonCount={10}
                isLoading={isLoading}
                isFetching={isFetching}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                renderSkeleton={UserListItemSkeleton}
                renderItem={(user: User): ReactElement => (
                    <UserListItem key={user.id} user={user} onFollow={handleFollow} onUnfollow={handleUnfollow} />
                )}
            />
        </ContentCardContainer>
    );
};
