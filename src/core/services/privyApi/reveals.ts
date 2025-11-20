import { INITIAL_PAGE_PARAM, PAGE_SIZE_LIMITS } from "@app/core/constants/ParamsConstants.ts";
import {
    User,
    privyApi,
    usersApi,
    QueryParams,
    PaginatedResponse,
    REVEAL_STATUS_TAG,
    REVEALED_LIST_TAG,
} from "@app/core/services";
import { RootState } from "@app/core/store";

export enum RevealStatus {
    OWNER = "OWNER",
    PUBLIC = "PUBLIC",
    ACCEPTED = "ACCEPTED",
    PENDING = "PENDING",
    REJECTED = "REJECTED",
    NONE = "NONE",
}

export interface ProfileReveal {
    id: string;
    createdAt: string;
    revealedToId: number;
    revealerId: number;
    revealedTo: Pick<
        User,
        "id" | "userName" | "isProfileIncognito" | "fullName" | "publicPhoto" | "privatePhoto" | "canViewFullProfile"
    >;
}

export interface RevealRequest {
    id: string;
    status: RevealStatus;
    createdAt: string;
    requesteeId: number;
    requesterId: number;
    requester: Pick<
        User,
        "id" | "userName" | "isProfileIncognito" | "fullName" | "publicPhoto" | "privatePhoto" | "canViewFullProfile"
    >;
}

export type RevealRequestListResponse = PaginatedResponse<RevealRequest>;
export type ProfileRevealListResponse = PaginatedResponse<ProfileReveal>;

type RevealListCache = { pages: RevealRequestListResponse[] };
type RevealedListCache = { pages: ProfileRevealListResponse[] };

export const revealsApi = privyApi.injectEndpoints({
    endpoints: builder => ({
        getPendingRevealRequests: builder.infiniteQuery<RevealRequestListResponse, QueryParams, number>({
            infiniteQueryOptions: {
                initialPageParam: INITIAL_PAGE_PARAM,
                getNextPageParam: (lastPage, _b, lastPageParam) => {
                    const totalPages: number = Math.ceil(lastPage.total / lastPage.limit);
                    return lastPageParam < totalPages ? lastPageParam + 1 : undefined;
                },
            },
            query: ({ queryArg: { query, limit }, pageParam }) => ({
                url: "reveals/requests/pending",
                params: {
                    query: query || "",
                    page: pageParam,
                    limit: limit || PAGE_SIZE_LIMITS.DEFAULT,
                },
            }),
            providesTags: result =>
                result
                    ? [
                          ...result.pages.flatMap(page =>
                              page.data.map(
                                  (request: RevealRequest) =>
                                      ({ type: REVEAL_STATUS_TAG, id: request.requester.userName }) as const
                              )
                          ),
                          { type: REVEAL_STATUS_TAG, id: "LIST" },
                      ]
                    : [{ type: REVEAL_STATUS_TAG, id: "LIST" }],
        }),
        getPeendingRevealRequestsCount: builder.query<{ count: number }, void>({
            query: () => ({
                url: "reveals/requests/count",
            }),
            providesTags: [{ type: REVEAL_STATUS_TAG, id: "COUNT" }],
        }),
        sendRevealRequest: builder.mutation<RevealRequest, { userName: string }>({
            query: ({ userName }) => ({
                url: `reveals/request/${userName}`,
                method: "POST",
            }),
            async onQueryStarted({ userName }, { dispatch, queryFulfilled }): Promise<void> {
                const { data } = await queryFulfilled;
                // Update the user profile cache to reflect the new reveal request status
                dispatch(
                    usersApi.util.updateQueryData("getUserProfile", { userName }, draft => {
                        draft.revealRequestStatus = data;
                    })
                );
            },
        }),

        deleteRevealRequestByUserName: builder.mutation<RevealRequest, { userName: string }>({
            query: ({ userName }) => ({
                url: `reveals/request/user/${userName}`,
                method: "DELETE",
            }),
            async onQueryStarted({ userName }, { dispatch, queryFulfilled }): Promise<void> {
                const { data } = await queryFulfilled;
                // Update the user profile cache to reflect the new reveal request status
                dispatch(
                    usersApi.util.updateQueryData("getUserProfile", { userName }, draft => {
                        draft.revealRequestStatus = data;
                    })
                );
            },
        }),

        respondToRevealRequest: builder.mutation<
            RevealRequest,
            { requestId: string; status: RevealStatus.ACCEPTED | RevealStatus.REJECTED }
        >({
            query: ({ requestId, status }) => ({
                url: `reveals/request/${requestId}`,
                method: "PATCH",
                body: { status },
            }),

            async onQueryStarted({ requestId }, { dispatch, queryFulfilled, getState }) {
                const { data: updatedRequest } = await queryFulfilled;
                const state = getState() as RootState;

                const allQueries = revealsApi.util.selectInvalidatedBy(state, [
                    { type: REVEAL_STATUS_TAG, id: "LIST" },
                ]);

                const updateRevealListRecipe = (draft: RevealListCache) => {
                    for (const page of draft.pages) {
                        const requestIndex: number = page.data.findIndex(req => req.id === requestId);
                        if (requestIndex !== -1) {
                            page.data[requestIndex] = updatedRequest;
                            break;
                        }
                    }
                };

                for (const { endpointName, originalArgs } of allQueries) {
                    if (endpointName === "getPendingRevealRequests") {
                        dispatch(
                            revealsApi.util.updateQueryData(
                                "getPendingRevealRequests",
                                originalArgs as QueryParams,
                                updateRevealListRecipe
                            )
                        );
                    }
                }

                dispatch(revealsApi.util.invalidateTags([{ type: REVEALED_LIST_TAG, id: "LIST" }]));
                dispatch(revealsApi.util.invalidateTags([{ type: REVEAL_STATUS_TAG, id: "COUNT" }]));
            },
        }),

        getRevealedProfiles: builder.infiniteQuery<ProfileRevealListResponse, QueryParams, number>({
            infiniteQueryOptions: {
                initialPageParam: INITIAL_PAGE_PARAM,
                getNextPageParam: (lastPage, _b, lastPageParam) => {
                    const totalPages: number = Math.ceil(lastPage.total / lastPage.limit);
                    return lastPageParam < totalPages ? lastPageParam + 1 : undefined;
                },
            },
            query: ({ queryArg: { query, limit }, pageParam }) => ({
                url: "reveals/revealed",
                params: {
                    query: query || "",
                    page: pageParam,
                    limit: limit || PAGE_SIZE_LIMITS.DEFAULT,
                },
            }),
            providesTags: result =>
                result
                    ? [
                          ...result.pages.flatMap(page =>
                              page.data.map(
                                  (profileReveal: ProfileReveal) =>
                                      ({ type: REVEALED_LIST_TAG, id: profileReveal.revealedTo.userName }) as const
                              )
                          ),
                          { type: REVEALED_LIST_TAG, id: "LIST" },
                      ]
                    : [{ type: REVEALED_LIST_TAG, id: "LIST" }],
        }),
        revokeProfileReveal: builder.mutation<{ status: RevealStatus.NONE }, { userName: string }>({
            query: ({ userName }) => ({
                url: `reveals/revealed/${userName}`,
                method: "DELETE",
            }),

            async onQueryStarted({ userName }, { dispatch, queryFulfilled, getState }) {
                await queryFulfilled;
                const state = getState() as RootState;

                const updateRevealedListRecipe = (draft: RevealedListCache) => {
                    for (const page of draft.pages) {
                        const index: number = page.data.findIndex(item => item.revealedTo.userName === userName);
                        if (index !== -1) {
                            page.data.splice(index, 1);
                            page.total = Math.max(0, page.total - 1);
                            break;
                        }
                    }
                };

                const allQueries = revealsApi.util.selectInvalidatedBy(state, [
                    { type: REVEALED_LIST_TAG, id: "LIST" },
                ]);

                for (const { endpointName, originalArgs } of allQueries) {
                    if (endpointName === "getRevealedProfiles") {
                        dispatch(
                            revealsApi.util.updateQueryData(
                                "getRevealedProfiles",
                                originalArgs as QueryParams,
                                updateRevealedListRecipe
                            )
                        );
                    }
                }
                // invalidate the reveal status list to reflect changes
                dispatch(revealsApi.util.invalidateTags([{ type: REVEAL_STATUS_TAG, id: "LIST" }]));
            },
        }),
    }),
    overrideExisting: false,
});

export const {
    useSendRevealRequestMutation,
    useRevokeProfileRevealMutation,
    useRespondToRevealRequestMutation,
    useGetRevealedProfilesInfiniteQuery,
    useGetPeendingRevealRequestsCountQuery,
    useDeleteRevealRequestByUserNameMutation,
    useGetPendingRevealRequestsInfiniteQuery,
} = revealsApi;
