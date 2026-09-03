/**
 * @file src/features/profile/ProfileCard/ProfileTabs/loaders/profileThreadsLoader.tsx
 * React Router loader for the current user's own threads tab. Serves the infinite query from cache
 * when it is already there, otherwise fetches the first page. Redirects to the profile page on error.
 */

import { redirect } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { InfiniteData } from "@tanstack/react-query";
import { PROFILE_PAGE_PATH } from "@app/core/constants/pathConstants";
import { PAGE_SIZE_LIMITS, INITIAL_PAGE_PARAM } from "@app/core/constants/ParamsConstants";
import {
    ApiError,
    QueryParams,
    queryClient,
    threadsApi,
    THREADS_KEYS,
    Thread,
    ThreadListResponse,
} from "@app/core/services";

/**
 * Data shape provided to the route element after a successful load.
 * @property threads The first page of the user's own threads, flattened.
 * @property params Query parameters the tab must keep using, so its hook hits the same cache key.
 */
export interface ProfileThreadsContext {
    threads: Thread[];
    params: QueryParams;
}

/**
 * Resolves the current user's own threads for the default profile tab.
 *
 * Flow mirrors `profilePhotosLoader`:
 * 1. Checks the cache for the profile threads infinite query.
 * 2. If cached, returns the flattened threads without a request.
 * 3. Otherwise fetches the first page.
 * 4. On failure, shows a notification and redirects to the profile page.
 *
 * All errors are handled internally; no exceptions are thrown outward.
 *
 * @returns {Promise<ProfileThreadsContext | Response>} The threads context, or a redirect response.
 */
export const profileThreadsLoader = async (): Promise<ProfileThreadsContext | Response> => {
    const params: QueryParams = { limit: PAGE_SIZE_LIMITS.DEFAULT };

    // Check cache first
    const cachedData = queryClient.getQueryData<InfiniteData<ThreadListResponse>>(THREADS_KEYS.profileList(params));

    if (cachedData) {
        const threads: Thread[] = cachedData.pages.flatMap((page: ThreadListResponse): Thread[] => page.data);
        return { threads, params };
    }

    try {
        const infiniteData = await queryClient.fetchInfiniteQuery({
            queryKey: THREADS_KEYS.profileList(params),
            queryFn: ({ pageParam }): Promise<ThreadListResponse> =>
                threadsApi.getProfileThreads({ ...params, page: pageParam }),
            initialPageParam: INITIAL_PAGE_PARAM,
        });
        const threads: Thread[] = infiniteData.pages.flatMap((page: ThreadListResponse): Thread[] => page.data);
        return { threads, params };
    } catch (error) {
        enqueueSnackbar((error as ApiError)?.message, { variant: "error" });
        return redirect(PROFILE_PAGE_PATH);
    }
};
