import { useDebounce } from "@app/core/hooks";
import { DEBOUNCE_DELAY } from "@app/core/constants/general";
import { FC, useState, ChangeEvent, ReactElement } from "react";
import { ProfileReveal, useGetRevealedProfilesInfiniteQuery } from "@app/core/services";
import { UserSearchField, RevealsStatsType, InfiniteScrollList, Spiner } from "@app/core/components";
import { RevealedProfilesListItem } from "@app/core/components/Features/User/Reveals/RevealedProfiles/RevealedProfilesListItem";

interface ApprovalListProps {
    type: RevealsStatsType;
}

export const RevealedProfiles: FC<ApprovalListProps> = ({ type }) => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const query: string = useDebounce(searchQuery, DEBOUNCE_DELAY);

    const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, isFetching } =
        useGetRevealedProfilesInfiniteQuery({ query }, { skip: type !== "revealedProfiles" });

    const profileReveals: ProfileReveal[] = useMemo<ProfileReveal[]>(
        () => data?.pages.flatMap(page => page.data) ?? [],
        [data]
    );
    const onSearchQueryChange = (event: ChangeEvent<HTMLInputElement>): void => setSearchQuery(event.target.value);

    return (
        <>
            <UserSearchField value={searchQuery} onChange={onSearchQueryChange} />
            <InfiniteScrollList<ProfileReveal>
                data={profileReveals}
                loaderCount={1}
                loader={Spiner}
                isLoading={isLoading}
                isFetching={isFetching}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                renderItem={(profileReveal: ProfileReveal, index: number): ReactElement => (
                    <RevealedProfilesListItem
                        key={profileReveal.id}
                        profileReveal={profileReveal}
                        isLast={index === profileReveals.length - 1}
                    />
                )}
            />
        </>
    );
};
