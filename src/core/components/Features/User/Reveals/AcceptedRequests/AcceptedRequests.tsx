import { useDebounce } from "@app/core/hooks";
import { DEBOUNCE_DELAY } from "@app/core/constants/general";
import { FC, useState, ChangeEvent, ReactElement } from "react";
import {
    RevealRequest,
    RevealStatus,
    RevealRequestListResponse,
    useGetRevealRequestsInfiniteQuery,
} from "@app/core/services";
import { UserSearchField, RevealsStatsType, InfiniteScrollList, Spiner } from "@app/core/components";
import { AcceptedRequestsListItem } from "@app/core/components/Features/User/Reveals/AcceptedRequests/AcceptedRequestsListItem";

interface ApprovalListProps {
    type: RevealsStatsType;
}

export const AcceptedRequests: FC<ApprovalListProps> = ({ type }) => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const query: string = useDebounce(searchQuery, DEBOUNCE_DELAY);

    const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, isFetching } =
        useGetRevealRequestsInfiniteQuery(
            { query, status: RevealStatus.ACCEPTED },
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
                    <AcceptedRequestsListItem
                        key={revealRequest.id}
                        revealRequest={revealRequest}
                        isLast={index === requests.length - 1}
                    />
                )}
            />
        </>
    );
};
