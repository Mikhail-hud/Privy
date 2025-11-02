import { RootState } from "@app/core/store";
import { INITIAL_PAGE_PARAM, PAGE_SIZE_LIMITS } from "@app/core/constants/ParamsConstants.ts";
import { Photo, privyApi, Profile, Tag, UserLink, USERS_LIST_TAG } from "@app/core/services";

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

export interface UserSummary extends Pick<Profile, "userName" | "id" | "isProfileIncognito"> {
    fullName?: string;
    publicPhoto?: Photo | null;
    privatePhoto?: Photo | null;
    isFollowedByCurrentUser: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
}
export type UserListResponse = PaginatedResponse<User>;
export type FollowersListResponse = PaginatedResponse<UserSummary>;

export interface UserQueryParams {
    query?: string;
    limit?: number;
}

export interface UsersParamsWithUserName extends UserQueryParams {
    userName: string;
}

type UserListCache = { pages: UserListResponse[] };
type FollowListCache = { pages: FollowersListResponse[] };

export const usersApi = privyApi.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.infiniteQuery<UserListResponse, UserQueryParams, number>({
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
                              page.data.map((user: User) => ({ type: USERS_LIST_TAG, id: user.userName }) as const)
                          ),
                          { type: USERS_LIST_TAG, id: "LIST" },
                      ]
                    : [{ type: USERS_LIST_TAG, id: "LIST" }],
        }),

        getUserProfile: builder.query<User, { userName: string }>({
            query: ({ userName }) => ({
                url: `users/${userName}`,
            }),
            providesTags: (_result, _error, { userName }) => [{ type: USERS_LIST_TAG, id: userName }],
        }),
        getUserFollowers: builder.infiniteQuery<FollowersListResponse, UsersParamsWithUserName, number>({
            infiniteQueryOptions: {
                initialPageParam: INITIAL_PAGE_PARAM,
                getNextPageParam: (lastPage, _b, lastPageParam) => {
                    const totalPages: number = Math.ceil(lastPage.total / lastPage.limit);
                    return lastPageParam < totalPages ? lastPageParam + 1 : undefined;
                },
            },
            query: ({ queryArg: { query, limit, userName }, pageParam }) => ({
                url: `users/${userName}/followers`,
                params: {
                    query: query || "",
                    page: pageParam,
                    limit: limit || PAGE_SIZE_LIMITS.DEFAULT,
                },
            }),
            providesTags: (result, _error, { userName }) =>
                result
                    ? [
                          ...result.pages.flatMap(page =>
                              page.data.map(
                                  (user: UserSummary) => ({ type: USERS_LIST_TAG, id: user.userName }) as const
                              )
                          ),
                          { type: USERS_LIST_TAG, id: `FOLLOWERS-${userName}` },
                          { type: USERS_LIST_TAG, id: "LIST" },
                      ]
                    : [
                          { type: USERS_LIST_TAG, id: `FOLLOWERS-${userName}` },
                          { type: USERS_LIST_TAG, id: "LIST" },
                      ],
        }),

        getUserFollowing: builder.infiniteQuery<FollowersListResponse, UsersParamsWithUserName, number>({
            infiniteQueryOptions: {
                initialPageParam: INITIAL_PAGE_PARAM,
                getNextPageParam: (lastPage, _b, lastPageParam) => {
                    const totalPages: number = Math.ceil(lastPage.total / lastPage.limit);
                    return lastPageParam < totalPages ? lastPageParam + 1 : undefined;
                },
            },
            query: ({ queryArg: { query, limit, userName }, pageParam }) => ({
                url: `users/${userName}/following`,
                params: {
                    query: query || "",
                    page: pageParam,
                    limit: limit || PAGE_SIZE_LIMITS.DEFAULT,
                },
            }),
            providesTags: (result, _error, { userName }) =>
                result
                    ? [
                          ...result.pages.flatMap(page =>
                              page.data.map(
                                  (user: UserSummary) => ({ type: USERS_LIST_TAG, id: user.userName }) as const
                              )
                          ),
                          { type: USERS_LIST_TAG, id: `FOLLOWING-${userName}` },
                          { type: USERS_LIST_TAG, id: "LIST" },
                      ]
                    : [
                          { type: USERS_LIST_TAG, id: `FOLLOWING-${userName}` },
                          { type: USERS_LIST_TAG, id: "LIST" },
                      ],
        }),

        followUser: builder.mutation<void, { userName: string }>({
            query: ({ userName }) => ({
                url: `users/${userName}/follow`,
                method: "POST",
            }),
            onQueryStarted: async ({ userName }, { dispatch, queryFulfilled, getState }) => {
                await queryFulfilled;
                const state: RootState = getState();
                const allQueries = usersApi.util.selectInvalidatedBy(state, [{ type: USERS_LIST_TAG, id: "LIST" }]);

                const updateUsersListRecipe = (draft: UserListCache) => {
                    for (const page of draft.pages) {
                        const user: User | undefined = page.data.find(
                            (user: User): boolean => user.userName === userName
                        );
                        if (user) {
                            user.isFollowedByCurrentUser = true;
                            user.followersCount += 1;
                        }
                    }
                };

                const updateFollowListRecipe = (draft: FollowListCache) => {
                    for (const page of draft.pages) {
                        const user: UserSummary | undefined = page.data.find(
                            (user: UserSummary): boolean => user.userName === userName
                        );
                        if (user) {
                            user.isFollowedByCurrentUser = true;
                        }
                    }
                };

                for (const { endpointName, originalArgs } of allQueries) {
                    if (endpointName === "getUsers") {
                        dispatch(
                            usersApi.util.updateQueryData(
                                "getUsers",
                                originalArgs as UserQueryParams,
                                updateUsersListRecipe
                            )
                        );
                    } else if (endpointName === "getUserFollowers") {
                        dispatch(
                            usersApi.util.updateQueryData(
                                "getUserFollowers",
                                originalArgs as UsersParamsWithUserName,
                                updateFollowListRecipe
                            )
                        );
                    } else if (endpointName === "getUserFollowing") {
                        dispatch(
                            usersApi.util.updateQueryData(
                                "getUserFollowing",
                                originalArgs as UsersParamsWithUserName,
                                updateFollowListRecipe
                            )
                        );
                    }
                }

                // Update the user profile cache
                dispatch(
                    usersApi.util.updateQueryData("getUserProfile", { userName }, draft => {
                        draft.isFollowedByCurrentUser = true;
                        draft.followersCount += 1;
                    })
                );
                // 4. // Update the current user's following count (as before)
                // dispatch(
                //     profileApi.util.updateQueryData("getProfile", undefined, draft => {
                //         draft.followingCount += 1;
                //     })
                // );
            },
        }),

        unFollowUser: builder.mutation<void, { userName: string }>({
            query: ({ userName }) => ({
                url: `users/${userName}/follow`,
                method: "DELETE",
            }),
            onQueryStarted: async ({ userName }, { dispatch, queryFulfilled, getState }) => {
                await queryFulfilled;
                const state: RootState = getState();

                const allQueries = usersApi.util.selectInvalidatedBy(state, [{ type: USERS_LIST_TAG, id: "LIST" }]);

                const updateUsersListRecipe = (draft: UserListCache) => {
                    for (const page of draft.pages) {
                        const user: User | undefined = page.data.find(
                            (user: User): boolean => user.userName === userName
                        );
                        if (user) {
                            user.isFollowedByCurrentUser = false;
                            user.followersCount = Math.max(user.followersCount - 1, 0);
                        }
                    }
                };

                const updateFollowListRecipe = (draft: FollowListCache) => {
                    for (const page of draft.pages) {
                        const user: UserSummary | undefined = page.data.find(
                            (user: UserSummary): boolean => user.userName === userName
                        );
                        if (user) {
                            user.isFollowedByCurrentUser = false;
                        }
                    }
                };

                for (const { endpointName, originalArgs } of allQueries) {
                    if (endpointName === "getUsers") {
                        dispatch(
                            usersApi.util.updateQueryData(
                                "getUsers",
                                originalArgs as UserQueryParams,
                                updateUsersListRecipe
                            )
                        );
                    } else if (endpointName === "getUserFollowers") {
                        dispatch(
                            usersApi.util.updateQueryData(
                                "getUserFollowers",
                                originalArgs as UsersParamsWithUserName,
                                updateFollowListRecipe
                            )
                        );
                    } else if (endpointName === "getUserFollowing") {
                        dispatch(
                            usersApi.util.updateQueryData(
                                "getUserFollowing",
                                originalArgs as UsersParamsWithUserName,
                                updateFollowListRecipe
                            )
                        );
                    }
                }
                // Update the user profile cache
                dispatch(
                    usersApi.util.updateQueryData("getUserProfile", { userName }, draft => {
                        draft.isFollowedByCurrentUser = false;
                        draft.followersCount = Math.max(draft.followersCount - 1, 0);
                    })
                );
                // 4. Update the current user's following count (as before)
                // dispatch(
                //     profileApi.util.updateQueryData("getProfile", undefined, draft => {
                //         draft.followingCount = Math.max(draft.followingCount - 1, 0);
                //     })
                // );
            },
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetUsersInfiniteQuery,
    useFollowUserMutation,
    useUnFollowUserMutation,
    useGetUserProfileQuery,
    useGetUserFollowersInfiniteQuery,
    useGetUserFollowingInfiniteQuery,
} = usersApi;
