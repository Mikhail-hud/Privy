import {
    InfiniteData,
    useInfiniteQuery,
    UseInfiniteQueryOptions,
    useMutation,
    UseMutationOptions,
} from "@tanstack/react-query";
import { INITIAL_PAGE_PARAM, PAGE_SIZE_LIMITS } from "@app/core/constants/ParamsConstants.ts";
import {
    apiClient,
    getNextPaginatedPageParam,
    PaginatedResponse,
    queryClient,
    QueryParams,
    Thread,
    ThreadMedia,
    THREADS_KEYS,
    User,
} from "@app/core/services";

/** A reply's media is byte-identical on the wire to a thread's, so the same shape serves both. */
export type ReplyMedia = ThreadMedia;

export interface Reply {
    id: string;
    content: string;
    media: ReplyMedia[];
    isIncognito: boolean;
    createdAt: string;
    threadId: string;
    isAuthorReply: boolean;
    isLikedByAuthor: boolean;
    replyToId: string | null;
    likeCount: number;
    childCount: number;
    isLikedByCurrentUser: boolean;
    isOwnedByCurrentUser: boolean;
    author: User | null;
}

export interface CreateReplyPayload {
    content: string;
    isIncognito?: boolean;
    replyToId?: string;
}

export type ReplyListResponse = PaginatedResponse<Reply>;

export interface ThreadRepliesParams extends QueryParams {
    threadId: string;
}

export const REPLIES_KEYS = {
    all: ["replies"] as const,
    threadList: (params: ThreadRepliesParams) => [...REPLIES_KEYS.all, "list", params] as const,
    detail: (id: string) => [...REPLIES_KEYS.all, "detail", id] as const,
};

export const repliesApi = {
    getThreadReplies: async ({
        threadId,
        query = "",
        limit = PAGE_SIZE_LIMITS.DEFAULT,
        page = INITIAL_PAGE_PARAM,
    }: ThreadRepliesParams): Promise<ReplyListResponse> => {
        return apiClient<ReplyListResponse>({
            url: `threads/${threadId}/replies`,
            params: { query, page, limit },
        });
    },

    /**
     * Posts a reply. `body` is a `FormData` when the reply carries media — axios fills in the
     * multipart boundary itself, exactly as `threadsApi.createThread` relies on.
     */
    createThreadReply: async (threadId: string, body: CreateReplyPayload): Promise<Reply> => {
        return apiClient<Reply>({
            url: `threads/${threadId}/replies`,
            method: "POST",
            body,
        });
    },

    deleteReply: async (id: string): Promise<void> => {
        return apiClient<void>({
            url: `replies/${id}`,
            method: "DELETE",
        });
    },

    likeReply: async (id: string): Promise<void> => {
        return apiClient<void>({
            url: `replies/${id}/like`,
            method: "POST",
        });
    },

    unlikeReply: async (id: string): Promise<void> => {
        return apiClient<void>({
            url: `replies/${id}/like`,
            method: "DELETE",
        });
    },
};

/** Applies a change to a reply across every cached reply-feed page. */
const patchCachedReply = (replyId: string, patch: (reply: Reply) => Reply): void => {
    queryClient.setQueriesData<InfiniteData<ReplyListResponse>>(
        { queryKey: [...REPLIES_KEYS.all, "list"] },
        oldData => {
            if (!oldData || !oldData.pages) return oldData;
            return {
                ...oldData,
                pages: oldData.pages.map((page: ReplyListResponse) => ({
                    ...page,
                    data: page.data.map((reply: Reply): Reply => (reply.id === replyId ? patch(reply) : reply)),
                })),
            };
        }
    );
};

/** Keeps the thread's `replyCount` in step with a reply being added or removed. */
const shiftThreadReplyCount = (threadId: string, delta: number): void => {
    queryClient.setQueryData<Thread>(THREADS_KEYS.detail(threadId), (thread?: Thread) =>
        thread ? { ...thread, replyCount: Math.max(0, thread.replyCount + delta) } : thread
    );
};

type ReplyFeedQueryOptions = Omit<
    UseInfiniteQueryOptions<ReplyListResponse, Error, InfiniteData<ReplyListResponse>>,
    "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
>;

export const useGetThreadRepliesInfiniteQuery = (params: ThreadRepliesParams, options?: ReplyFeedQueryOptions) => {
    return useInfiniteQuery({
        queryKey: REPLIES_KEYS.threadList(params),
        queryFn: ({ pageParam }) => repliesApi.getThreadReplies({ ...params, page: pageParam as number }),
        initialPageParam: INITIAL_PAGE_PARAM,
        getNextPageParam: getNextPaginatedPageParam,
        enabled: !!params.threadId,
        ...options,
    });
};

export const useCreateReplyMutation = (
    options?: UseMutationOptions<Reply, Error, { threadId: string; data: CreateReplyPayload }>
) => {
    return useMutation({
        mutationFn: ({ threadId, data }): Promise<Reply> => repliesApi.createThreadReply(threadId, data),
        onSuccess: (_reply: Reply, { threadId }): void => {
            // A new reply shifts every page boundary, so refetch rather than splice it in.
            queryClient.invalidateQueries({ queryKey: [...REPLIES_KEYS.all, "list"] });
            shiftThreadReplyCount(threadId, 1);
        },
        ...options,
    });
};

export const useDeleteReplyMutation = (options?: UseMutationOptions<void, Error, { id: string; threadId: string }>) => {
    return useMutation({
        mutationFn: ({ id }): Promise<void> => repliesApi.deleteReply(id),
        onSuccess: (_data: void, { id, threadId }): void => {
            queryClient.setQueriesData<InfiniteData<ReplyListResponse>>(
                { queryKey: [...REPLIES_KEYS.all, "list"] },
                oldData => {
                    if (!oldData || !oldData.pages) return oldData;
                    return {
                        ...oldData,
                        pages: oldData.pages.map((page: ReplyListResponse) => ({
                            ...page,
                            data: page.data.filter((reply: Reply): boolean => reply.id !== id),
                        })),
                    };
                }
            );
            shiftThreadReplyCount(threadId, -1);
        },
        ...options,
    });
};

export const useLikeReplyMutation = (options?: UseMutationOptions<void, Error, string>) => {
    return useMutation({
        mutationFn: repliesApi.likeReply,
        onSuccess: (_data: void, replyId: string): void => {
            patchCachedReply(
                replyId,
                (reply: Reply): Reply => ({
                    ...reply,
                    isLikedByCurrentUser: true,
                    likeCount: reply.likeCount + 1,
                })
            );
        },
        ...options,
    });
};

export const useUnlikeReplyMutation = (options?: UseMutationOptions<void, Error, string>) => {
    return useMutation({
        mutationFn: repliesApi.unlikeReply,
        onSuccess: (_data: void, replyId: string): void => {
            patchCachedReply(
                replyId,
                (reply: Reply): Reply => ({
                    ...reply,
                    isLikedByCurrentUser: false,
                    likeCount: reply.likeCount - 1,
                })
            );
        },
        ...options,
    });
};
