/**
 * Loader for the thread details page.
 * Resolves the thread behind `:threadId` from the cache if available, otherwise dispatches an API call.
 * Redirects to TalkSpace on error.
 * @file src/features/threadDetails/loaders/threadDetailsLoader.tsx
 */

import { enqueueSnackbar } from "notistack";
import { LoaderFunctionArgs, redirect } from "react-router-dom";
import { TALK_SPACE_PAGE_PATH } from "@app/core/constants/pathConstants";
import { ApiError, queryClient, Thread, THREADS_KEYS, threadsApi } from "@app/core/services";

/**
 * Thread details context made available to the route element.
 * @property thread Resolved thread entity loaded from cache or fetched from API.
 * @property threadId ID of the thread, used for query keys and other lookups.
 */
export interface ThreadDetailsContext {
    thread: Thread;
    threadId: string;
}

/**
 * React Router loader that resolves the thread for `/thread/:threadId`.
 *
 * Flow:
 * 1. Rejects a missing `threadId` with a redirect to TalkSpace.
 * 2. Returns immediately when the thread is already in the query cache.
 * 3. Otherwise fetches it via `threadsApi.getThread`, seeding the cache the page's
 *    `useGetThreadQuery` reads from.
 * 4. On failure (missing thread, network error) shows a snackbar and redirects to TalkSpace.
 *
 * Replies are deliberately not prefetched — the feed loads its own first page, and a slow reply
 * query should not hold up rendering the thread itself.
 *
 * @returns {Promise<ThreadDetailsContext | Response>} Resolves with the details context or a redirect response.
 *
 * @example
 * // In a route definition: src/core/app/App.tsx
 * {
 *   loader: threadDetailsLoader,
 *   path: THREAD_DETAILS_PAGE_PATH,
 *   element: <ThreadDetails />,
 * },
 */
export const threadDetailsLoader = async ({ params }: LoaderFunctionArgs): Promise<ThreadDetailsContext | Response> => {
    const threadId: string | undefined = params.threadId;

    if (!threadId) {
        enqueueSnackbar("Thread not found", { variant: "error" });
        return redirect(TALK_SPACE_PAGE_PATH);
    }

    // Check cache first
    const cachedThread: Thread | undefined = queryClient.getQueryData<Thread>(THREADS_KEYS.detail(threadId));
    if (cachedThread) {
        return { thread: cachedThread, threadId };
    }

    try {
        const thread: Thread = await queryClient.fetchQuery({
            queryKey: THREADS_KEYS.detail(threadId),
            queryFn: (): Promise<Thread> => threadsApi.getThread(threadId),
        });
        return { thread, threadId };
    } catch (error) {
        const errorMessage: string = (error as ApiError)?.message;
        enqueueSnackbar(errorMessage, { variant: "error" });
        return redirect(TALK_SPACE_PAGE_PATH);
    }
};
