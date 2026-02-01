/**
 * Loader for thread lists, used in TalkSpace features.
 * Fetches threads from the cache if available, otherwise dispatches an API call.
 * Redirects to the profile page on error.
 * @file src/features/talkSpace/loaders/talkSpaceLoader.tsx
 */

import { redirect } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { InfiniteData } from "@tanstack/react-query";
import { PROFILE_PAGE_PATH } from "@app/core/constants/pathConstants";
import { PAGE_SIZE_LIMITS, INITIAL_PAGE_PARAM } from "@app/core/constants/ParamsConstants.ts";
import {
    QueryParams,
    queryClient,
    ApiError,
    Thread,
    ThreadListResponse,
    THREADS_KEYS,
    threadsApi,
} from "@app/core/services";

/**
 * Thread list context made available to route elements.
 * @property threads Array of threads returned by the `getThreads` endpoint.
 * @property params Query parameters used for fetching threads.
 */
export interface ThreadsContext {
    threads: Thread[];
    params: QueryParams;
}

/**
 * React Router loader that resolves the current thread list for TalkSpace routes.
 *
 * Flow:
 * 1. Reads cached `getThreads` infinite query result from the query client.
 * 2. If the cached query is successful, returns the threads without a network request.
 * 3. Otherwise, fetches threads using the threadsApi.
 * 4. On success returns `{ threads, params }`.
 * 5. On failure (e.g., network error) returns a redirect `Response` to the profile page.
 *
 * No errors are thrown outward: failures are normalized into a redirect.
 *
 * @returns {Promise<ThreadsContext | Response>} Resolves with thread list context or a redirect response.
 *
 * @example
 * // In a route definition: src/core/app/App.tsx
 * {
 *   loader: talkSpaceLoader,
 *   path: TALK_SPACE_PAGE_PATH,
 *   element: <TalkSpace />,
 * },
 */
export const talkSpaceLoader = async (): Promise<ThreadsContext | Response> => {
    const params = { query: "", limit: PAGE_SIZE_LIMITS.DEFAULT };

    // Check cache first
    const cachedData = queryClient.getQueryData<InfiniteData<ThreadListResponse>>(THREADS_KEYS.list(params));
    if (cachedData) {
        const threads: Thread[] = cachedData.pages.flatMap(page => page.data);
        return { threads, params };
    }

    try {
        const infiniteData = await queryClient.fetchInfiniteQuery({
            queryKey: THREADS_KEYS.list(params),
            queryFn: ({ pageParam }): Promise<ThreadListResponse> =>
                threadsApi.getThreads({ ...params, page: pageParam }),
            initialPageParam: INITIAL_PAGE_PARAM,
        });
        const threads: Thread[] = infiniteData.pages.flatMap(page => page.data);
        return { threads, params };
    } catch (error) {
        const errorMessage: string = (error as ApiError)?.message;
        enqueueSnackbar(errorMessage, { variant: "error" });
        return redirect(PROFILE_PAGE_PATH);
    }
};
