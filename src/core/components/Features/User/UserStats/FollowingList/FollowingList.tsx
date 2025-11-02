import { useDebounce } from "@app/core/hooks";
import { DEBOUNCE_DELAY } from "@app/core/constants/general";
import { FC, useState, ChangeEvent, ReactElement } from "react";
import { useGetUserFollowingInfiniteQuery, UserSummary } from "@app/core/services";
import { UserStatsType, InfiniteScrollList, Spiner, UserSearchField } from "@app/core/components";
import { UserSummaryListItem } from "@app/core/components/Features/User/UserStats/UserSummaryListItem";

interface FollowingListProps {
    userName: string;
    type: UserStatsType;
    isOwnerUserName?: string;
    onFollow: (userName: string) => void;
    onUnfollow: (userName: string) => void;
}

export const FollowingList: FC<FollowingListProps> = ({ userName, type, onFollow, onUnfollow, isOwnerUserName }) => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const query: string = useDebounce(searchQuery, DEBOUNCE_DELAY);

    const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, isFetching } =
        useGetUserFollowingInfiniteQuery({ userName, query }, { skip: type !== "following" });

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
                        onFollow={onFollow}
                        onUnfollow={onUnfollow}
                        isOwnerUserName={isOwnerUserName}
                        isLast={index === users.length - 1}
                    />
                )}
            />
        </>
    );
};
