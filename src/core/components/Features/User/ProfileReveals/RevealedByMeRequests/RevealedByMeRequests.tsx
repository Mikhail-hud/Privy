import { useDebounce } from "@app/core/hooks";
import { DEBOUNCE_DELAY } from "@app/core/constants/general";
import { FC, useState, ChangeEvent, ReactElement } from "react";
import {
    ProfileRevealByMe,
    ProfileRevealByMeListResponse,
    useGetRevealedByMeProfilesInfiniteQuery,
} from "@app/core/services";
import { UserSearchField, InfiniteScrollList, Spiner, ProfileRevealsStatsType } from "@app/core/components";
import { RevealedByMeRequestsListItem } from "@app/core/components/Features/User/ProfileReveals/RevealedByMeRequests/RevealedByMeRequestsListItem";

interface RevealedByMeRequestsProps {
    type: ProfileRevealsStatsType;
}

export const RevealedByMeRequests: FC<RevealedByMeRequestsProps> = ({ type }) => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const query: string = useDebounce(searchQuery, DEBOUNCE_DELAY);

    const {
        data: toMeData,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        isFetching,
    } = useGetRevealedByMeProfilesInfiniteQuery({ query }, { enabled: type === "revealedByMe" });

    const profileReveas: ProfileRevealByMe[] = useMemo<ProfileRevealByMe[]>(
        () => toMeData?.pages.flatMap((page: ProfileRevealByMeListResponse): ProfileRevealByMe[] => page.data) ?? [],
        [toMeData]
    );
    const onSearchQueryChange = (event: ChangeEvent<HTMLInputElement>): void => setSearchQuery(event.target.value);

    return (
        <>
            <UserSearchField value={searchQuery} onChange={onSearchQueryChange} />
            <InfiniteScrollList<ProfileRevealByMe>
                data={profileReveas}
                loaderCount={1}
                loader={Spiner}
                isLoading={isLoading}
                isFetching={isFetching}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                renderItem={(revealRequest: ProfileRevealByMe, index: number): ReactElement => (
                    <RevealedByMeRequestsListItem
                        key={revealRequest.id}
                        revealRequest={revealRequest}
                        isLast={index === profileReveas.length - 1}
                    />
                )}
            />
        </>
    );
};
