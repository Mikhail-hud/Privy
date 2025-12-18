import { useDebounce } from "@app/core/hooks";
import { DEBOUNCE_DELAY } from "@app/core/constants/general";
import { ChangeEvent, FC, ReactElement, useState } from "react";
import {
    RevealStatus,
    RequesterRevealRequest,
    RequesterRevealRequestListResponse,
    useGetRevealRequestsInfiniteQuery,
} from "@app/core/services";
import { InfiniteScrollList, RevealsStatsType, Spiner, UserSearchField } from "@app/core/components";
import { IncomingRequestsListItem } from "@app/core/components/Features/User/RevealsRequests/IncomingRequests/IncomingRequestsListItem";
interface ApprovalListProps {
    type: RevealsStatsType;
}

export const IncomingRequests: FC<ApprovalListProps> = ({ type }) => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const query: string = useDebounce(searchQuery, DEBOUNCE_DELAY);

    const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, isFetching } =
        useGetRevealRequestsInfiniteQuery(
            { query, status: RevealStatus.PENDING },
            { enabled: type === "incomingRequests" }
        );

    const requests: RequesterRevealRequest[] = useMemo<RequesterRevealRequest[]>(
        () =>
            data?.pages.flatMap((page: RequesterRevealRequestListResponse): RequesterRevealRequest[] => page.data) ??
            [],
        [data]
    );

    const onSearchQueryChange = (event: ChangeEvent<HTMLInputElement>): void => setSearchQuery(event.target.value);

    return (
        <>
            <UserSearchField value={searchQuery} onChange={onSearchQueryChange} />
            <InfiniteScrollList<RequesterRevealRequest>
                data={requests}
                loaderCount={1}
                loader={Spiner}
                isLoading={isLoading}
                isFetching={isFetching}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                renderItem={(revealRequest: RequesterRevealRequest, index: number): ReactElement => (
                    <IncomingRequestsListItem
                        key={revealRequest.id}
                        revealRequest={revealRequest}
                        isLast={index === requests.length - 1}
                    />
                )}
            />
        </>
    );
};
