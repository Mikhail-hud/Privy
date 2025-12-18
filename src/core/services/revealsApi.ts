import {
    useQuery,
    useMutation,
    InfiniteData,
    UseQueryOptions,
    useInfiniteQuery,
    UseMutationOptions,
    UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { INITIAL_PAGE_PARAM, PAGE_SIZE_LIMITS } from "@app/core/constants/ParamsConstants";
import { apiClient, PaginatedResponse, queryClient, QueryParams, User, USERS_KEYS } from "@app/core/services";

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
}

export interface RevealRequest {
    id: string;
    status: RevealStatus;
    createdAt: string;
    requesteeId: number;
    requesterId: number;
}

export type ProfileRevealUser = Pick<
    User,
    "id" | "userName" | "isProfileIncognito" | "fullName" | "publicPhoto" | "privatePhoto" | "canViewFullProfile"
>;

export type RevealRequestUser = Pick<
    User,
    "id" | "userName" | "isProfileIncognito" | "fullName" | "publicPhoto" | "privatePhoto" | "canViewFullProfile"
>;

interface ProfileRevealWithRevealer<TUser> extends ProfileReveal {
    revealer: TUser;
}
interface ProfileRevealWithRevealedTo<TUser> extends ProfileReveal {
    revealedTo: TUser;
}

interface RevealRequestWithRequester<TUser> extends RevealRequest {
    requester: TUser;
}
interface RevealRequestWithRequestee<TUser> extends RevealRequest {
    requestee: TUser;
}

export type RequesterRevealRequest = RevealRequestWithRequester<RevealRequestUser>;

export type RequesteeRevealRequest = RevealRequestWithRequestee<RevealRequestUser>;

export type ProfileRevealByMe = ProfileRevealWithRevealedTo<ProfileRevealUser>;
export type ProfileRevealToMe = ProfileRevealWithRevealer<ProfileRevealUser>;

export interface RevealQueryParams extends QueryParams {
    status?: RevealStatus;
}

export type RequesterRevealRequestListResponse = PaginatedResponse<RequesterRevealRequest>;
export type RequesteeRevealRequestListResponse = PaginatedResponse<RequesteeRevealRequest>;

export type ProfileRevealByMeListResponse = PaginatedResponse<ProfileRevealByMe>;
export type ProfileRevealToMeListResponse = PaginatedResponse<ProfileRevealToMe>;

// Query Keys
export const REVEALS_KEYS = {
    all: ["reveals"] as const,
    requests: (params: QueryParams) => [...REVEALS_KEYS.all, "requests", params] as const,
    sentRequests: (params: QueryParams) => [...REVEALS_KEYS.all, "sentRequests", params] as const,
    pendingCount: () => [...REVEALS_KEYS.all, "pendingCount"] as const,
    revealedByMeProfiles: (params: QueryParams) => [...REVEALS_KEYS.all, "revealedByMeProfiles", params] as const,
    revealedToMeProfiles: (params: QueryParams) => [...REVEALS_KEYS.all, "revealedToMeProfiles", params] as const,
};

// API Functions
export const revealsApi = {
    getRevealRequests: async ({
        query = "",
        limit = PAGE_SIZE_LIMITS.DEFAULT,
        page = INITIAL_PAGE_PARAM,
        status,
    }: RevealQueryParams): Promise<RequesterRevealRequestListResponse> => {
        return apiClient<RequesterRevealRequestListResponse>({
            url: "reveals/requests",
            params: { query, page, limit, status },
        });
    },

    getSentRevealRequests: async ({
        query = "",
        limit = PAGE_SIZE_LIMITS.DEFAULT,
        page = INITIAL_PAGE_PARAM,
        status,
    }: RevealQueryParams): Promise<RequesteeRevealRequestListResponse> => {
        return apiClient<RequesteeRevealRequestListResponse>({
            url: "reveals/requests/sent",
            params: { query, page, limit, status },
        });
    },

    getPendingRevealRequestsCount: async (): Promise<{ count: number }> => {
        return apiClient<{ count: number }>({
            url: "reveals/requests/count",
        });
    },

    sendRevealRequest: async (userName: string): Promise<RequesterRevealRequest> => {
        return apiClient<RequesterRevealRequest>({
            url: `reveals/request/${userName}`,
            method: "POST",
        });
    },

    deleteRevealRequestByUserName: async (userName: string): Promise<RequesterRevealRequest> => {
        return apiClient<RequesterRevealRequest>({
            url: `reveals/request/user/${userName}`,
            method: "DELETE",
        });
    },

    respondToRevealRequest: async ({
        requestId,
        status,
    }: {
        requestId: string;
        status: RevealStatus.ACCEPTED | RevealStatus.REJECTED;
    }): Promise<RequesterRevealRequest> => {
        return await apiClient<RequesterRevealRequest>({
            url: `reveals/request/${requestId}`,
            method: "PATCH",
            body: { status },
        });
    },

    getRevealedByMeProfiles: async ({
        query = "",
        limit = PAGE_SIZE_LIMITS.DEFAULT,
        page = INITIAL_PAGE_PARAM,
    }: QueryParams): Promise<ProfileRevealByMeListResponse> => {
        return apiClient<ProfileRevealByMeListResponse>({
            url: "reveals/access/by-me",
            params: { query, page, limit },
        });
    },
    getRevealedToMeProfiles: async ({
        query = "",
        limit = PAGE_SIZE_LIMITS.DEFAULT,
        page = INITIAL_PAGE_PARAM,
    }: QueryParams): Promise<ProfileRevealToMeListResponse> => {
        return apiClient<ProfileRevealToMeListResponse>({
            url: "reveals/access/to-me",
            params: { query, page, limit },
        });
    },

    revokeProfileReveal: async (userName: string): Promise<{ status: RevealStatus.NONE }> => {
        return await apiClient<{ status: RevealStatus.NONE }>({
            url: `reveals/revealed/${userName}`,
            method: "DELETE",
        });
    },
};

export const useGetRevealRequestsInfiniteQuery = (
    params: RevealQueryParams,
    options?: Omit<
        UseInfiniteQueryOptions<
            RequesterRevealRequestListResponse,
            Error,
            InfiniteData<RequesterRevealRequestListResponse>
        >,
        "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
    >
) => {
    return useInfiniteQuery({
        queryKey: REVEALS_KEYS.requests(params),
        queryFn: ({ pageParam }) => revealsApi.getRevealRequests({ ...params, page: pageParam as number }),
        initialPageParam: INITIAL_PAGE_PARAM,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
            const totalPages = Math.ceil(lastPage.total / lastPage.limit);
            return (lastPageParam as number) < totalPages ? (lastPageParam as number) + 1 : undefined;
        },
        ...options,
    });
};

export const useGetSentRevealRequestsInfiniteQuery = (
    params: RevealQueryParams,
    options?: Omit<
        UseInfiniteQueryOptions<
            RequesteeRevealRequestListResponse,
            Error,
            InfiniteData<RequesteeRevealRequestListResponse>
        >,
        "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
    >
) => {
    return useInfiniteQuery({
        queryKey: REVEALS_KEYS.sentRequests(params),
        queryFn: ({ pageParam }) => revealsApi.getSentRevealRequests({ ...params, page: pageParam as number }),
        initialPageParam: INITIAL_PAGE_PARAM,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
            const totalPages = Math.ceil(lastPage.total / lastPage.limit);
            return (lastPageParam as number) < totalPages ? (lastPageParam as number) + 1 : undefined;
        },
        ...options,
    });
};

export const useGetPeendingRevealRequestsCountQuery = (
    options?: Omit<UseQueryOptions<{ count: number }>, "queryKey" | "queryFn">
) => {
    // Get count of pending reveal requests for the current user
    return useQuery({
        queryKey: REVEALS_KEYS.pendingCount(),
        queryFn: revealsApi.getPendingRevealRequestsCount,
        ...options,
    });
};

export const useSendRevealRequestMutation = (options?: UseMutationOptions<RequesterRevealRequest, Error, string>) => {
    // Sent reveal request from user details page
    return useMutation({
        mutationFn: revealsApi.sendRevealRequest,
        onSuccess: (newRevealRequestStatus: RequesterRevealRequest, userName: string): void => {
            // Update user profile cache to reflect the new request data
            queryClient.setQueryData<User>(USERS_KEYS.profile(userName), user => {
                if (!user) return user;
                return {
                    ...user,
                    revealRequestStatus: newRevealRequestStatus,
                };
            });
            // Invalidate sentRequests list cache to include the new request
            queryClient.invalidateQueries({ queryKey: REVEALS_KEYS.sentRequests({ query: "" }) });
        },
        ...options,
    });
};

export const useDeleteRevealRequestByUserNameMutation = (
    options?: UseMutationOptions<RequesterRevealRequest, Error, string>
) => {
    // Cancel reveal request from user details page
    return useMutation({
        mutationFn: revealsApi.deleteRevealRequestByUserName,
        onSuccess: (newRevealRequestStatus: RequesterRevealRequest, userName: string): void => {
            // Update user profile cache to reflect the removed request
            queryClient.setQueryData<User>(USERS_KEYS.profile(userName), user => {
                if (!user) return user;
                return {
                    ...user,
                    revealRequestStatus: newRevealRequestStatus,
                };
            });
            // Update sentRequests list cache to remove the cancelled request
            queryClient.setQueriesData<InfiniteData<RequesteeRevealRequestListResponse>>(
                { queryKey: ["reveals", "sentRequests"] },
                oldData => {
                    if (!oldData || !oldData.pages) return oldData;
                    return {
                        ...oldData,
                        pages: oldData.pages.map((page: RequesteeRevealRequestListResponse) => ({
                            ...page,
                            data: page.data.filter(
                                (req: RequesteeRevealRequest): boolean => req.requestee?.userName !== userName
                            ),
                        })),
                    };
                }
            );
        },
        ...options,
    });
};

export const useRespondToRevealRequestMutation = (
    options?: UseMutationOptions<
        RequesterRevealRequest,
        Error,
        { requestId: string; status: RevealStatus.ACCEPTED | RevealStatus.REJECTED }
    >
) => {
    return useMutation({
        mutationFn: revealsApi.respondToRevealRequest,
        onSuccess: (data: RequesterRevealRequest, { requestId }): void => {
            // Update requestsList cache to reflect the updated request status
            queryClient.setQueriesData<InfiniteData<RequesterRevealRequestListResponse>>(
                { queryKey: ["reveals", "requests"] },
                oldData => {
                    if (!oldData || !oldData.pages) return oldData;
                    return {
                        ...oldData,
                        pages: oldData.pages.map((page: RequesterRevealRequestListResponse) => ({
                            ...page,
                            data: page.data.map((req): RequesterRevealRequest => (req.id === requestId ? data : req)),
                        })),
                    };
                }
            );
            // Invalidate revealedByMeProfiles cache to reflect any changes
            queryClient.invalidateQueries({ queryKey: REVEALS_KEYS.revealedByMeProfiles({ query: "" }) });
        },
        ...options,
    });
};

export const useRevokeProfileRevealMutation = (
    options?: UseMutationOptions<{ status: RevealStatus.NONE }, Error, string>
) => {
    return useMutation({
        mutationFn: revealsApi.revokeProfileReveal,
        onSuccess: (_data: { status: RevealStatus.NONE }, userName: string): void => {
            // Update revealed by me profiles cache to remove profile reveal request
            queryClient.setQueriesData<InfiniteData<ProfileRevealByMeListResponse>>(
                { queryKey: ["reveals", "revealedByMeProfiles"] },
                oldData => {
                    if (!oldData || !oldData.pages) return oldData;
                    return {
                        ...oldData,
                        pages: oldData.pages.map((page: ProfileRevealByMeListResponse) => ({
                            ...page,
                            data: page.data.filter(
                                (req: ProfileRevealByMe): boolean => req.revealedTo.userName !== userName
                            ),
                        })),
                    };
                }
            );

            // Invalidate requests cache to reflect the change
            queryClient.invalidateQueries({ queryKey: REVEALS_KEYS.requests({ query: "" }) });
        },
        ...options,
    });
};

export const useGetRevealedByMeProfilesInfiniteQuery = (
    params: QueryParams,
    options?: Omit<
        UseInfiniteQueryOptions<ProfileRevealByMeListResponse, Error, InfiniteData<ProfileRevealByMeListResponse>>,
        "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
    >
) => {
    return useInfiniteQuery({
        queryKey: REVEALS_KEYS.revealedByMeProfiles(params),
        queryFn: ({ pageParam }) => revealsApi.getRevealedByMeProfiles({ ...params, page: pageParam as number }),
        initialPageParam: INITIAL_PAGE_PARAM,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
            const totalPages = Math.ceil(lastPage.total / lastPage.limit);
            return (lastPageParam as number) < totalPages ? (lastPageParam as number) + 1 : undefined;
        },
        ...options,
    });
};

export const useGetRevealedToMeProfilesInfiniteQuery = (
    params: QueryParams,
    options?: Omit<
        UseInfiniteQueryOptions<ProfileRevealToMeListResponse, Error, InfiniteData<ProfileRevealToMeListResponse>>,
        "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
    >
) => {
    return useInfiniteQuery({
        queryKey: REVEALS_KEYS.revealedToMeProfiles(params),
        queryFn: ({ pageParam }) => revealsApi.getRevealedToMeProfiles({ ...params, page: pageParam as number }),
        initialPageParam: INITIAL_PAGE_PARAM,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
            const totalPages = Math.ceil(lastPage.total / lastPage.limit);
            return (lastPageParam as number) < totalPages ? (lastPageParam as number) + 1 : undefined;
        },
        ...options,
    });
};
