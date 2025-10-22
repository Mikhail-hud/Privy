import { Photo, privyApi, Profile, USERS_LIST_TAG } from "@app/core/services";
import { INITIAL_PAGE_PARAM, PAGE_SIZE_LIMITS } from "@app/core/constants/ParamsConstants.ts";

// TODO: Extend User model when needed
export interface User
    extends Pick<
        Profile,
        "userName" | "id" | "biography" | "isProfileIncognito" | "followingCount" | "followersCount"
    > {
    fullName?: string;
    publicPhoto?: Photo | null;
    privatePhoto?: Photo | null;
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

            providesTags: () => [USERS_LIST_TAG],
        }),

        followUser: builder.mutation<void, { id: number }>({
            query: ({ id }) => ({
                url: `users/${id}/follow`,
                method: "POST",
            }),
            invalidatesTags: () => [USERS_LIST_TAG],
        }),

        unFollowUser: builder.mutation<void, { id: number }>({
            query: ({ id }) => ({
                url: `users/${id}/follow`,
                method: "DELETE",
            }),
            invalidatesTags: () => [USERS_LIST_TAG],
        }),
    }),
    overrideExisting: false,
});

export const { useGetUsersInfiniteQuery, useFollowUserMutation, useUnFollowUserMutation } = usersApi;
