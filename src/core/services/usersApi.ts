import {
    useQuery,
    useMutation,
    InfiniteData,
    UseQueryResult,
    UseQueryOptions,
    useInfiniteQuery,
    UseMutationResult,
    UseMutationOptions,
    UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { apiClient } from "@app/core/services/apiClient";
import { queryClient } from "@app/core/services/queryClient";
import { Photo, Profile, RevealRequest, Tag, UserLink } from "@app/core/services";
import { INITIAL_PAGE_PARAM, PAGE_SIZE_LIMITS } from "@app/core/constants/ParamsConstants";

export interface User
    extends Pick<Profile, "userName" | "id" | "isProfileIncognito" | "followingCount" | "followersCount"> {
    fullName?: string;
    publicPhoto?: Photo | null;
    privatePhoto?: Photo | null;
    biography?: string;
    links?: UserLink[];
    interests?: Tag[];
    revealRequestStatus?: RevealRequest;
    canViewFullProfile: boolean;
    isFollowedByCurrentUser: boolean;
}

export interface UserSummary extends Pick<Profile, "userName" | "id" | "isProfileIncognito"> {
    fullName?: string;
    publicPhoto?: Photo | null;
    privatePhoto?: Photo | null;
    canViewFullProfile: boolean;
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

export interface QueryParams {
    query?: string;
    limit?: number;
    page?: number;
}

export interface UsersParamsWithUserName extends QueryParams {
    userName: string;
}

const updateUserCacheAfterFollow = (userName: string, isFollowing: boolean) => {
    // Update the User Profile Cache (Single User)
    queryClient.setQueryData<User>(USERS_KEYS.profile(userName), oldUser => {
        if (!oldUser) return oldUser;
        return {
            ...oldUser,
            isFollowedByCurrentUser: isFollowing,
            followersCount: Math.max(0, oldUser.followersCount + (isFollowing ? 1 : -1)),
        };
    });

    // Update the "All Users" List Cache
    queryClient.setQueriesData<InfiniteData<UserListResponse>>({ queryKey: ["users", "list"] }, oldData => {
        if (!oldData) return oldData;
        return {
            ...oldData,
            pages: oldData.pages.map((page: UserListResponse) => ({
                ...page,
                data: page.data.map((user: User): User => {
                    if (user.userName === userName) {
                        return {
                            ...user,
                            isFollowedByCurrentUser: isFollowing,
                            followersCount: Math.max(0, user.followersCount + (isFollowing ? 1 : -1)),
                        };
                    }
                    return user;
                }),
            })),
        };
    });

    //Update Followers/Following Lists on Profile Pages
    const updateSummaryLists = (queryKeyPrefix: readonly string[]) => {
        queryClient.setQueriesData<InfiniteData<FollowersListResponse>>({ queryKey: queryKeyPrefix }, oldData => {
            if (!oldData) return oldData;
            return {
                ...oldData,
                pages: oldData.pages.map((page: FollowersListResponse) => ({
                    ...page,
                    data: page.data.map((user: UserSummary): UserSummary => {
                        if (user.userName === userName) {
                            return { ...user, isFollowedByCurrentUser: isFollowing };
                        }
                        return user;
                    }),
                })),
            };
        });
    };

    updateSummaryLists(["users", "followers"]);
    updateSummaryLists(["users", "following"]);

    // // 4. Update Current User Profile
    // queryClient.setQueryData<Profile>(PROFILE_KEYS.getProfile(), myProfile => {
    //     if (!myProfile) return myProfile;
    //     return {
    //         ...myProfile,
    //         followingCount: Math.max(0, myProfile.followingCount + (isFollowing ? 1 : -1)),
    //     };
    // });
    // queryClient.setQueryData<Profile>(AUTH_KEYS.me(), myProfile => {
    //     if (!myProfile) return myProfile;
    //     return {
    //         ...myProfile,
    //         followingCount: Math.max(0, myProfile.followingCount + (isFollowing ? 1 : -1)),
    //     };
    // });
};

// Query Keys
export const USERS_KEYS = {
    all: ["users"] as const,
    list: (params: QueryParams) => [...USERS_KEYS.all, "list", params] as const,
    profile: (userName: string) => [...USERS_KEYS.all, "profile", userName] as const,
    followers: (params: UsersParamsWithUserName) => [...USERS_KEYS.all, "followers", params] as const,
    following: (params: UsersParamsWithUserName) => [...USERS_KEYS.all, "following", params] as const,
};

// API Functions
export const usersApi = {
    getUsers: async ({
        query = "",
        limit = PAGE_SIZE_LIMITS.DEFAULT,
        page = INITIAL_PAGE_PARAM,
    }: QueryParams): Promise<UserListResponse> => {
        return apiClient<UserListResponse>({
            url: "users",
            params: { query, page, limit },
        });
    },

    getUserProfile: async (userName: string): Promise<User> => {
        return apiClient<User>({
            url: `users/${userName}`,
        });
    },

    getUserFollowers: async ({
        query = "",
        limit = PAGE_SIZE_LIMITS.DEFAULT,
        page = INITIAL_PAGE_PARAM,
        userName,
    }: UsersParamsWithUserName): Promise<FollowersListResponse> => {
        return apiClient<FollowersListResponse>({
            url: `users/${userName}/followers`,
            params: { query, page, limit },
        });
    },

    getUserFollowing: async ({
        query = "",
        limit = PAGE_SIZE_LIMITS.DEFAULT,
        page = INITIAL_PAGE_PARAM,
        userName,
    }: UsersParamsWithUserName): Promise<FollowersListResponse> => {
        return apiClient<FollowersListResponse>({
            url: `users/${userName}/following`,
            params: { query, page, limit },
        });
    },

    followUser: async (userName: string): Promise<void> => {
        await apiClient<void>({
            url: `users/${userName}/follow`,
            method: "POST",
        });
    },

    unFollowUser: async (userName: string): Promise<void> => {
        await apiClient<void>({
            url: `users/${userName}/follow`,
            method: "DELETE",
        });
    },
};

// React Hooks
export const useGetUsersInfiniteQuery = (
    params: QueryParams,
    options?: Omit<
        UseInfiniteQueryOptions<UserListResponse, Error, InfiniteData<UserListResponse>>,
        "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
    >
) => {
    return useInfiniteQuery({
        queryKey: USERS_KEYS.list(params),
        queryFn: ({ pageParam }) => usersApi.getUsers({ ...params, page: pageParam as number }),
        initialPageParam: INITIAL_PAGE_PARAM,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
            const totalPages: number = Math.ceil(lastPage.total / lastPage.limit);
            return (lastPageParam as number) < totalPages ? (lastPageParam as number) + 1 : undefined;
        },
        ...options,
    });
};

export const useGetUserProfileQuery = (
    userName: string,
    options?: Omit<UseQueryOptions<User>, "queryKey" | "queryFn">
): UseQueryResult<User, Error> => {
    return useQuery({
        queryKey: USERS_KEYS.profile(userName),
        queryFn: (): Promise<User> => usersApi.getUserProfile(userName),
        enabled: !!userName,
        ...options,
    });
};

export const useGetUserFollowersInfiniteQuery = (
    params: UsersParamsWithUserName,
    options?: Omit<
        UseInfiniteQueryOptions<FollowersListResponse, Error, InfiniteData<FollowersListResponse>>,
        "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
    >
) => {
    return useInfiniteQuery({
        queryKey: USERS_KEYS.followers(params),
        queryFn: ({ pageParam }): Promise<FollowersListResponse> =>
            usersApi.getUserFollowers({
                ...params,
                page: pageParam as number,
            }),
        initialPageParam: INITIAL_PAGE_PARAM,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
            const totalPages: number = Math.ceil(lastPage.total / lastPage.limit);
            return (lastPageParam as number) < totalPages ? (lastPageParam as number) + 1 : undefined;
        },
        ...options,
    });
};

export const useGetUserFollowingInfiniteQuery = (
    params: UsersParamsWithUserName,
    options?: Omit<
        UseInfiniteQueryOptions<FollowersListResponse, Error, InfiniteData<FollowersListResponse>>,
        "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
    >
) => {
    return useInfiniteQuery({
        queryKey: USERS_KEYS.following(params),
        queryFn: ({ pageParam }): Promise<FollowersListResponse> =>
            usersApi.getUserFollowing({ ...params, page: pageParam as number }),
        initialPageParam: INITIAL_PAGE_PARAM,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
            const totalPages: number = Math.ceil(lastPage.total / lastPage.limit);
            return (lastPageParam as number) < totalPages ? (lastPageParam as number) + 1 : undefined;
        },
        ...options,
    });
};

export const useFollowUserMutation = (
    options?: UseMutationOptions<void, Error, string>
): UseMutationResult<void, Error, string> => {
    return useMutation({
        mutationFn: usersApi.followUser,
        onSuccess: (_data: void, userName: string): void => {
            updateUserCacheAfterFollow(userName, true);
        },
        ...options,
    });
};

export const useUnFollowUserMutation = (
    options?: UseMutationOptions<void, Error, string>
): UseMutationResult<void, Error, string> => {
    return useMutation({
        mutationFn: usersApi.unFollowUser,
        onSuccess: (_data: void, userName: string): void => {
            updateUserCacheAfterFollow(userName, false);
        },
        ...options,
    });
};
