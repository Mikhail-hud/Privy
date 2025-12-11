import { useDebounce } from "@app/core/hooks";
import { DEBOUNCE_DELAY } from "@app/core/constants/general";
import { ChangeEvent, FC, ReactElement, useState } from "react";
import {
    RevealRequest,
    RevealStatus,
    RevealRequestListResponse,
    useGetRevealRequestsInfiniteQuery,
} from "@app/core/services";
import { InfiniteScrollList, RevealsStatsType, Spiner, UserSearchField } from "@app/core/components";
import { RevealRequestsListItem } from "@app/core/components/Features/User/Reveals/RevealRequests/RevealRequestsListItem";

interface ApprovalListProps {
    type: RevealsStatsType;
}

export const RevealRequests: FC<ApprovalListProps> = ({ type }) => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const query: string = useDebounce(searchQuery, DEBOUNCE_DELAY);

    const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, isFetching } =
        useGetRevealRequestsInfiniteQuery(
            { query, status: RevealStatus.PENDING },
            { enabled: type === "revealRequests" }
        );

    const requests: RevealRequest[] = useMemo<RevealRequest[]>(
        () => data?.pages.flatMap((page: RevealRequestListResponse): RevealRequest[] => page.data) ?? [],
        [data]
    );

    const onSearchQueryChange = (event: ChangeEvent<HTMLInputElement>): void => setSearchQuery(event.target.value);

    return (
        <>
            <UserSearchField value={searchQuery} onChange={onSearchQueryChange} />
            <InfiniteScrollList<RevealRequest>
                data={requests}
                loaderCount={1}
                loader={Spiner}
                isLoading={isLoading}
                isFetching={isFetching}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                renderItem={(revealRequest: RevealRequest, index: number): ReactElement => (
                    <RevealRequestsListItem
                        key={revealRequest.id}
                        revealRequest={revealRequest}
                        isLast={index === requests.length - 1}
                    />
                )}
            />
        </>
    );
};
