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

export interface RevealQueryParams extends QueryParams {
    status?: RevealStatus;
}

export type RevealRequestListResponse = PaginatedResponse<RevealRequest>;
export type ProfileRevealListResponse = PaginatedResponse<ProfileReveal>;

// Query Keys
export const REVEALS_KEYS = {
    all: ["reveals"] as const,
    requests: (params: QueryParams) => [...REVEALS_KEYS.all, "requests", params] as const,
    pendingCount: () => [...REVEALS_KEYS.all, "pendingCount"] as const,
    revealedProfiles: (params: QueryParams) => [...REVEALS_KEYS.all, "revealedProfiles", params] as const,
};

// API Functions
export const revealsApi = {
    getRevealRequests: async ({
        query = "",
        limit = PAGE_SIZE_LIMITS.DEFAULT,
        page = INITIAL_PAGE_PARAM,
        status,
    }: RevealQueryParams): Promise<RevealRequestListResponse> => {
        return apiClient<RevealRequestListResponse>({
            url: "reveals/requests",
            params: { query, page, limit, status },
        });
    },
    getPendingRevealRequestsCount: async (): Promise<{ count: number }> => {
        return apiClient<{ count: number }>({
            url: "reveals/requests/count",
        });
    },

    sendRevealRequest: async (userName: string): Promise<RevealRequest> => {
        return apiClient<RevealRequest>({
            url: `reveals/request/${userName}`,
            method: "POST",
        });
    },

    deleteRevealRequestByUserName: async (userName: string): Promise<RevealRequest> => {
        return apiClient<RevealRequest>({
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
    }): Promise<RevealRequest> => {
        return await apiClient<RevealRequest>({
            url: `reveals/request/${requestId}`,
            method: "PATCH",
            body: { status },
        });
    },

    getRevealedProfiles: async ({
        query = "",
        limit = PAGE_SIZE_LIMITS.DEFAULT,
        page = INITIAL_PAGE_PARAM,
    }: QueryParams): Promise<ProfileRevealListResponse> => {
        return apiClient<ProfileRevealListResponse>({
            url: "reveals/revealed",
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
        UseInfiniteQueryOptions<RevealRequestListResponse, Error, InfiniteData<RevealRequestListResponse>>,
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

export const useGetPeendingRevealRequestsCountQuery = (
    options?: Omit<UseQueryOptions<{ count: number }>, "queryKey" | "queryFn">
) => {
    return useQuery({
        queryKey: REVEALS_KEYS.pendingCount(),
        queryFn: revealsApi.getPendingRevealRequestsCount,
        ...options,
    });
};

export const useSendRevealRequestMutation = (options?: UseMutationOptions<RevealRequest, Error, string>) => {
    return useMutation({
        mutationFn: revealsApi.sendRevealRequest,
        onSuccess: (data: RevealRequest, userName: string): void => {
            queryClient.setQueryData<User>(USERS_KEYS.profile(userName), oldUser => {
                if (!oldUser) return oldUser;
                return {
                    ...oldUser,
                    revealRequestStatus: data,
                };
            });
        },
        ...options,
    });
};

export const useDeleteRevealRequestByUserNameMutation = (
    options?: UseMutationOptions<RevealRequest, Error, string>
) => {
    return useMutation({
        mutationFn: revealsApi.deleteRevealRequestByUserName,
        onSuccess: (data: RevealRequest, userName: string): void => {
            queryClient.setQueryData<User>(USERS_KEYS.profile(userName), oldUser => {
                if (!oldUser) return oldUser;
                return {
                    ...oldUser,
                    revealRequestStatus: data,
                };
            });
        },
        ...options,
    });
};

export const useRespondToRevealRequestMutation = (
    options?: UseMutationOptions<
        RevealRequest,
        Error,
        { requestId: string; status: RevealStatus.ACCEPTED | RevealStatus.REJECTED }
    >
) => {
    return useMutation({
        mutationFn: revealsApi.respondToRevealRequest,
        onSuccess: (data: RevealRequest, { requestId }): void => {
            queryClient.setQueriesData<InfiniteData<RevealRequestListResponse>>(
                { queryKey: ["reveals", "requests"] },
                oldData => {
                    if (!oldData || !oldData.pages) return oldData;
                    return {
                        ...oldData,
                        pages: oldData.pages.map(page => ({
                            ...page,
                            data: page.data.map(req => (req.id === requestId ? data : req)),
                        })),
                    };
                }
            );
            // IF the request was accepted, add it to ACCEPTED caches
            if (data.status === RevealStatus.ACCEPTED) {
                queryClient.setQueriesData<InfiniteData<RevealRequestListResponse>>(
                    {
                        queryKey: ["reveals", "requests"],
                        // Filter only caches that requested ACCEPTED status.
                        predicate: query => {
                            const [_a, _b, params] = query.queryKey as [string, string, RevealQueryParams];
                            return params?.status === RevealStatus.ACCEPTED;
                        },
                    },
                    oldData => {
                        // If there's no old data, return it as is.
                        if (!oldData || !oldData.pages) return oldData;

                        // Check if the request already exists in the cache to avoid duplicates.
                        const exists: boolean = oldData.pages.some(page => page.data.some(req => req.id === data.id));
                        if (exists) return oldData;

                        const newPages = [...oldData.pages];
                        const FIRST_PAGE_INDEX = 0;

                        // Add the new accepted request to the first page.
                        if (newPages.length > FIRST_PAGE_INDEX) {
                            const firstPage = newPages[FIRST_PAGE_INDEX];

                            newPages[FIRST_PAGE_INDEX] = {
                                ...firstPage,
                                data: [data, ...firstPage.data],
                                total: firstPage.total + 1,
                            };
                        }

                        return { ...oldData, pages: newPages };
                    }
                );
            }

            // IF the request was rejected, remove it from ACCEPTED caches
            if (data.status === RevealStatus.REJECTED) {
                queryClient.setQueriesData<InfiniteData<RevealRequestListResponse>>(
                    {
                        queryKey: ["reveals", "requests"],
                        // Filter only caches that requested ACCEPTED status.
                        predicate: query => {
                            const [_a, _b, params] = query.queryKey as [string, string, RevealQueryParams];
                            return params?.status === RevealStatus.ACCEPTED;
                        },
                    },
                    oldData => {
                        if (!oldData || !oldData.pages) return oldData;
                        return {
                            ...oldData,
                            pages: oldData.pages.map(page => ({
                                ...page,
                                data: page.data.filter(req => req.id !== requestId),
                            })),
                        };
                    }
                );
            }
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
            // Update reveals requests cache to remove any requests to this user
            queryClient.setQueriesData<InfiniteData<RevealRequestListResponse>>(
                { queryKey: ["reveals", "requests"] },
                oldData => {
                    if (!oldData || !oldData.pages) return oldData;
                    return {
                        ...oldData,
                        pages: oldData.pages.map(page => ({
                            ...page,
                            data: page.data.filter(req => req.requester.userName !== userName),
                        })),
                    };
                }
            );
        },
        ...options,
    });
};

// export const useGetRevealedProfilesInfiniteQuery = (
//     params: QueryParams,
//     options?: Omit<
//         UseInfiniteQueryOptions<ProfileRevealListResponse, Error, InfiniteData<ProfileRevealListResponse>>,
//         "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
//     >
// ) => {
//     return useInfiniteQuery({
//         queryKey: REVEALS_KEYS.revealedProfiles(params),
//         queryFn: ({ pageParam }) => revealsApi.getRevealedProfiles({ ...params, pageParam: pageParam as number }),
//         initialPageParam: INITIAL_PAGE_PARAM,
//         getNextPageParam: (lastPage, _allPages, lastPageParam) => {
//             const totalPages = Math.ceil(lastPage.total / lastPage.limit);
//             return (lastPageParam as number) < totalPages ? (lastPageParam as number) + 1 : undefined;
//         },
//         ...options,
//     });
// };
