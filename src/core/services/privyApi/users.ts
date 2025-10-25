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
                              page.data.map(user => ({ type: USERS_LIST_TAG, id: user.id }) as const)
                          ),
                          { type: USERS_LIST_TAG, id: "LIST" },
                      ]
                    : [{ type: USERS_LIST_TAG, id: "LIST" }],
        }),
        getUserProfile: builder.query<User, { userName: string }>({
            query: ({ userName }) => ({
                url: `users/${userName}`,
            }),
            providesTags: (rusult, _error) => [{ type: USERS_LIST_TAG, id: rusult?.id }],
        }),

        followUser: builder.mutation<void, { id: number }>({
            query: ({ id }) => ({
                url: `users/${id}/follow`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: USERS_LIST_TAG, id: "LIST" },
                { type: USERS_LIST_TAG, id },
            ],
        }),

        unFollowUser: builder.mutation<void, { id: number }>({
            query: ({ id }) => ({
                url: `users/${id}/follow`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: USERS_LIST_TAG, id: "LIST" },
                { type: USERS_LIST_TAG, id },
            ],
        }),
    }),
    overrideExisting: false,
});

export const { useGetUsersInfiniteQuery, useFollowUserMutation, useUnFollowUserMutation, useGetUserProfileQuery } =
    usersApi;
