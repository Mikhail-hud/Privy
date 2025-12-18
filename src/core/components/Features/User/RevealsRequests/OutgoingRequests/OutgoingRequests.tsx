import { useDebounce } from "@app/core/hooks";
import { DEBOUNCE_DELAY } from "@app/core/constants/general";
import { ChangeEvent, FC, ReactElement, useState } from "react";
import {
    RevealStatus,
    RequesteeRevealRequest,
    RequesteeRevealRequestListResponse,
    useGetSentRevealRequestsInfiniteQuery,
} from "@app/core/services";
import { InfiniteScrollList, RevealsStatsType, Spiner, UserSearchField } from "@app/core/components";
import { OutgoingRequestsListItem } from "@app/core/components/Features/User/RevealsRequests/OutgoingRequests/OutgoingRequestsListItem";

interface ApprovalListProps {
    type: RevealsStatsType;
}

export const OutgoingRequests: FC<ApprovalListProps> = ({ type }) => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const query: string = useDebounce(searchQuery, DEBOUNCE_DELAY);

    const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, isFetching } =
        useGetSentRevealRequestsInfiniteQuery(
            { query, status: RevealStatus.PENDING },
            { enabled: type === "outgoingRequests" }
        );

    const requests: RequesteeRevealRequest[] = useMemo<RequesteeRevealRequest[]>(
        () =>
            data?.pages.flatMap((page: RequesteeRevealRequestListResponse): RequesteeRevealRequest[] => page.data) ??
            [],
        [data]
    );

    const onSearchQueryChange = (event: ChangeEvent<HTMLInputElement>): void => setSearchQuery(event.target.value);

    return (
        <>
            <UserSearchField value={searchQuery} onChange={onSearchQueryChange} />
            <InfiniteScrollList<RequesteeRevealRequest>
                data={requests}
                loaderCount={1}
                loader={Spiner}
                isLoading={isLoading}
                isFetching={isFetching}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                renderItem={(revealRequest: RequesteeRevealRequest, index: number): ReactElement => (
                    <OutgoingRequestsListItem
                        key={revealRequest.id}
                        revealRequest={revealRequest}
                        isLast={index === requests.length - 1}
                    />
                )}
            />
        </>
    );
};
