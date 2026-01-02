import {
    useMutation,
    InfiniteData,
    useInfiniteQuery,
    UseMutationOptions,
    UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { INITIAL_PAGE_PARAM, PAGE_SIZE_LIMITS } from "@app/core/constants/ParamsConstants.ts";
import { apiClient, PaginatedResponse, queryClient, QueryParams, User } from "@app/core/services";

export interface ThreadMedia {
    id: string;
    key: string;
    src: string;
    order: number;
    fileSize: number;
    threadId: string;
    mimeType: string;
    createdAt: string;
    originalFilename: "string";
}

export interface Thread {
    id: string;
    content: string;
    media: ThreadMedia[];
    isIncognito: false;
    createdAt: string;
    likeCount: number;
    replyCount: number;
    isLikedByCurrentUser: boolean;
    isOwnedByCurrentUser: boolean;
    tags: string[];
    author: User | null;
}

export interface CreateThreadPayload {
    content: string;
    isIncognito?: boolean;
    tags?: string[];
}

export type ThreadListResponse = PaginatedResponse<Thread>;

export const THREADS_KEYS = {
    all: ["threads"] as const,
    list: (params: QueryParams) => [...THREADS_KEYS.all, "list", params] as const,
};

export const threadsApi = {
    createThread: async (body: CreateThreadPayload): Promise<Thread> => {
        return await apiClient<Thread>({
            url: "threads",
            method: "POST",
            body,
        });
    },

    updateThead: async (id: string, body: Partial<CreateThreadPayload>): Promise<Thread> => {
        return await apiClient<Thread>({
            url: `threads/${id}`,
            method: "PATCH",
            body,
        });
    },

    deleteThread: async (id: string): Promise<void> => {
        return await apiClient<void>({
            url: `threads/${id}`,
            method: "DELETE",
        });
    },

    likeThread: async (id: string): Promise<void> => {
        return await apiClient<void>({
            url: `threads/${id}/like`,
            method: "POST",
        });
    },

    unlikeThread: async (id: string): Promise<void> => {
        return await apiClient<void>({
            url: `threads/${id}/like`,
            method: "DELETE",
        });
    },
    getThreads: async ({
        query = "",
        limit = PAGE_SIZE_LIMITS.DEFAULT,
        page = INITIAL_PAGE_PARAM,
    }: QueryParams): Promise<ThreadListResponse> => {
        return apiClient<ThreadListResponse>({
            url: "threads",
            params: { query, page, limit },
        });
    },
};

export const useCreateThreadMutation = (options?: UseMutationOptions<Thread, Error, CreateThreadPayload>) => {
    return useMutation({
        mutationFn: threadsApi.createThread,
        onSuccess: (_thread: Thread): void => {
            queryClient.invalidateQueries({ queryKey: THREADS_KEYS.all });
        },
        ...options,
    });
};

export const useUpdateThreadMutation = (
    options?: UseMutationOptions<Thread, Error, { id: string; data: Partial<CreateThreadPayload> }>
) => {
    return useMutation({
        mutationFn: ({ id, data }): Promise<Thread> => threadsApi.updateThead(id, data),
        onSuccess: (updatedThread: Thread): void => {
            queryClient.setQueriesData<InfiniteData<ThreadListResponse>>({ queryKey: ["threads", "list"] }, oldData => {
                if (!oldData || !oldData.pages) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page: ThreadListResponse) => ({
                        ...page,
                        data: page.data.map(
                            (thread: Thread): Thread => (thread.id === updatedThread.id ? updatedThread : thread)
                        ),
                    })),
                };
            });
        },
        ...options,
    });
};

export const useDeleteThreadMutation = (options?: UseMutationOptions<void, Error, string>) => {
    return useMutation({
        mutationFn: threadsApi.deleteThread,
        onSuccess: (_data: void, thredId: string): void => {
            queryClient.setQueriesData<InfiniteData<ThreadListResponse>>({ queryKey: ["threads", "list"] }, oldData => {
                if (!oldData || !oldData.pages) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page: ThreadListResponse) => ({
                        ...page,
                        data: page.data.filter((thread: Thread): boolean => thread.id !== thredId),
                    })),
                };
            });
        },
        ...options,
    });
};

export const useLikeThreadMutation = (options?: UseMutationOptions<void, Error, string>) => {
    return useMutation({
        mutationFn: threadsApi.likeThread,
        onSuccess: (_data: void, threadId: string): void => {
            queryClient.setQueriesData<InfiniteData<ThreadListResponse>>({ queryKey: ["threads", "list"] }, oldData => {
                if (!oldData || !oldData.pages) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page: ThreadListResponse) => ({
                        ...page,
                        data: page.data.map((thread: Thread) =>
                            thread.id === threadId
                                ? {
                                      ...thread,
                                      isLikedByCurrentUser: true,
                                      likeCount: thread.likeCount + 1,
                                  }
                                : thread
                        ),
                    })),
                };
            });
        },
        ...options,
    });
};

export const useUnlikeThreadMutation = (options?: UseMutationOptions<void, Error, string>) => {
    return useMutation({
        mutationFn: threadsApi.unlikeThread,
        onSuccess: (_data: void, threadId: string): void => {
            queryClient.setQueriesData<InfiniteData<ThreadListResponse>>({ queryKey: ["threads", "list"] }, oldData => {
                if (!oldData || !oldData.pages) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page: ThreadListResponse) => ({
                        ...page,
                        data: page.data.map((thread: Thread) =>
                            thread.id === threadId
                                ? {
                                      ...thread,
                                      isLikedByCurrentUser: false,
                                      likeCount: thread.likeCount - 1,
                                  }
                                : thread
                        ),
                    })),
                };
            });
        },
        ...options,
    });
};

// React Hooks
export const useGetThreadsInfiniteQuery = (
    params: QueryParams,
    options?: Omit<
        UseInfiniteQueryOptions<ThreadListResponse, Error, InfiniteData<ThreadListResponse>>,
        "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
    >
) => {
    return useInfiniteQuery({
        queryKey: THREADS_KEYS.list(params),
        queryFn: ({ pageParam }) => threadsApi.getThreads({ ...params, page: pageParam as number }),
        initialPageParam: INITIAL_PAGE_PARAM,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
            const totalPages: number = Math.ceil(lastPage.total / lastPage.limit);
            return (lastPageParam as number) < totalPages ? (lastPageParam as number) + 1 : undefined;
        },
        ...options,
    });
};
