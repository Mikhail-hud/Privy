import { useDebounce } from "@app/core/hooks";
import { DEBOUNCE_DELAY } from "@app/core/constants/general";
import { FC, useState, ChangeEvent, ReactElement } from "react";
import {
    ProfileRevealToMe,
    ProfileRevealToMeListResponse,
    useGetRevealedToMeProfilesInfiniteQuery,
} from "@app/core/services";
import { UserSearchField, InfiniteScrollList, Spiner, ProfileRevealsStatsType } from "@app/core/components";
import { RevealedToMeRequestsListItem } from "@app/core/components/Features/User/ProfileReveals/RevealedToMeRequests/RevealedToMeRequestsListItem";

interface RevealedToMeRequestsProps {
    type: ProfileRevealsStatsType;
}

export const RevealedToMeRequests: FC<RevealedToMeRequestsProps> = ({ type }) => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const query: string = useDebounce(searchQuery, DEBOUNCE_DELAY);

    const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, isFetching } =
        useGetRevealedToMeProfilesInfiniteQuery({ query }, { enabled: type === "revealedToMe" });

    const profileReveas: ProfileRevealToMe[] = useMemo<ProfileRevealToMe[]>(
        () => data?.pages.flatMap((page: ProfileRevealToMeListResponse): ProfileRevealToMe[] => page.data) ?? [],
        [data]
    );
    const onSearchQueryChange = (event: ChangeEvent<HTMLInputElement>): void => setSearchQuery(event.target.value);

    return (
        <>
            <UserSearchField value={searchQuery} onChange={onSearchQueryChange} />
            <InfiniteScrollList<ProfileRevealToMe>
                data={profileReveas}
                loaderCount={1}
                loader={Spiner}
                isLoading={isLoading}
                isFetching={isFetching}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                renderItem={(revealRequest: ProfileRevealToMe, index: number): ReactElement => (
                    <RevealedToMeRequestsListItem
                        key={revealRequest.id}
                        revealRequest={revealRequest}
                        isLast={index === profileReveas.length - 1}
                    />
                )}
            />
        </>
    );
};
