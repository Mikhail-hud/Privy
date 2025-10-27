import { RootState } from "@app/core/store";
import { Photo, privyApi, Profile, Tag, UserLink, USERS_LIST_TAG } from "@app/core/services";
import { INITIAL_PAGE_PARAM, PAGE_SIZE_LIMITS } from "@app/core/constants/ParamsConstants.ts";

export interface User
    extends Pick<Profile, "userName" | "id" | "isProfileIncognito" | "followingCount" | "followersCount"> {
    fullName?: string;
    publicPhoto?: Photo | null;
    privatePhoto?: Photo | null;
    biography?: string;
    links?: UserLink[];
    interests?: Tag[];
    isFollowedByCurrentUser: boolean;
}

export interface UserList {
    data: User[];
    page: number;
    limit: number;
    total: number;
}

export interface GetAllUsersParams {
    query?: string;
    limit?: number;
}

export const usersApi = privyApi.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.infiniteQuery<UserList, GetAllUsersParams, number>({
            infiniteQueryOptions: {
                initialPageParam: INITIAL_PAGE_PARAM,
                getNextPageParam: (lastPage, _b, lastPageParam) => {
                    const totalPages: number = Math.ceil(lastPage.total / lastPage.limit);
                    return lastPageParam < totalPages ? lastPageParam + 1 : undefined;
                },
            },
            query: ({ queryArg: { query, limit }, pageParam }) => ({
                url: "users",
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
                              page.data.map((user: User) => ({ type: USERS_LIST_TAG, id: user.id }) as const)
                          ),
                          { type: USERS_LIST_TAG, id: "LIST" },
                      ]
                    : [{ type: USERS_LIST_TAG, id: "LIST" }],
        }),

        getUserProfile: builder.query<User, { userName: string }>({
            query: ({ userName }) => ({
                url: `users/${userName}`,
            }),
            providesTags: (result, _error) => [{ type: USERS_LIST_TAG, id: result?.id }],
        }),

        followUser: builder.mutation<void, { id: number; userName?: string }>({
            query: ({ id }) => ({
                url: `users/${id}/follow`,
                method: "POST",
            }),
            onQueryStarted: async ({ id, userName }, { dispatch, queryFulfilled, getState }) => {
                await queryFulfilled;
                const state: RootState = getState();
                const allQueries = usersApi.util.selectInvalidatedBy(state, [{ type: USERS_LIST_TAG, id: "LIST" }]);

                for (const { endpointName, originalArgs } of allQueries) {
                    if (endpointName !== "getUsers") continue;
                    dispatch(
                        usersApi.util.updateQueryData(endpointName, originalArgs as GetAllUsersParams, draft => {
                            for (const page of draft.pages) {
                                const user: User | undefined = page.data.find((user: User): boolean => user.id === id);
                                if (user) {
                                    user.isFollowedByCurrentUser = true;
                                    user.followersCount += 1;
                                }
                            }
                        })
                    );
                }

                if (userName) {
                    dispatch(
                        usersApi.util.updateQueryData("getUserProfile", { userName }, draft => {
                            draft.isFollowedByCurrentUser = true;
                            draft.followersCount += 1;
                        })
                    );
                }
            },
        }),

        unFollowUser: builder.mutation<void, { id: number; userName?: string }>({
            query: ({ id }) => ({
                url: `users/${id}/follow`,
                method: "DELETE",
            }),
            onQueryStarted: async ({ id, userName }, { dispatch, queryFulfilled, getState }) => {
                await queryFulfilled;
                const state: RootState = getState();
                const allQueries = usersApi.util.selectInvalidatedBy(state, [{ type: USERS_LIST_TAG, id: "LIST" }]);

                for (const { endpointName, originalArgs } of allQueries) {
                    if (endpointName !== "getUsers") continue;
                    dispatch(
                        usersApi.util.updateQueryData(endpointName, originalArgs as GetAllUsersParams, draft => {
                            for (const page of draft.pages) {
                                const user: User | undefined = page.data.find((user: User): boolean => user.id === id);
                                if (user) {
                                    user.isFollowedByCurrentUser = false;
                                    user.followersCount = Math.max(user.followersCount - 1, 0);
                                }
                            }
                        })
                    );
                }

                if (userName) {
                    dispatch(
                        usersApi.util.updateQueryData("getUserProfile", { userName }, draft => {
                            draft.isFollowedByCurrentUser = false;
                            draft.followersCount = Math.max(draft.followersCount - 1, 0);
                        })
                    );
                }
            },
        }),
    }),
    overrideExisting: false,
});

export const { useGetUsersInfiniteQuery, useFollowUserMutation, useUnFollowUserMutation, useGetUserProfileQuery } =
    usersApi;
