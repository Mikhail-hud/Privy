import { useDebounce } from "@app/core/hooks";
import { DEBOUNCE_DELAY } from "@app/core/constants/general";
import { FC, useState, ChangeEvent, ReactElement, MouseEvent } from "react";
import { useGetUserFollowersInfiniteQuery, UserSummary } from "@app/core/services";
import { UserStatsType, InfiniteScrollList, Spiner, UserSearchField } from "@app/core/components";
import { UserSummaryListItem } from "@app/core/components/Features/User/UserStats/UserSummaryListItem";

interface FollowersListProps {
    userName: string;
    type: UserStatsType;
    isOwnerUserName?: string;
    onListItemClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export const FollowersList: FC<FollowersListProps> = ({ userName, type, isOwnerUserName, onListItemClick }) => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const query: string = useDebounce(searchQuery, DEBOUNCE_DELAY);

    const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, isFetching } =
        useGetUserFollowersInfiniteQuery({ userName, query }, { skip: type !== "followers" });

    const users: UserSummary[] = useMemo<UserSummary[]>(() => data?.pages.flatMap(page => page.data) ?? [], [data]);

    const onSearchQueryChange = (event: ChangeEvent<HTMLInputElement>): void => setSearchQuery(event.target.value);

    return (
        <>
            <UserSearchField value={searchQuery} onChange={onSearchQueryChange} />
            <InfiniteScrollList<UserSummary>
                data={users}
                loaderCount={1}
                loader={Spiner}
                isLoading={isLoading}
                isFetching={isFetching}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                renderItem={(user: UserSummary, index: number): ReactElement => (
                    <UserSummaryListItem
                        key={user.id}
                        user={user}
                        onListItemClick={onListItemClick}
                        isOwnerUserName={isOwnerUserName}
                        isLast={index === users.length - 1}
                    />
                )}
            />
        </>
    );
};
