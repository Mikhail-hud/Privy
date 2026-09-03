/**
 * @file src/features/userProfile/UserProfileCard/UserProfileTabs/loaders/userThreadsLoader.tsx
 * React Router loader for another user's threads tab. Serves the infinite query from cache when it is
 * already there, otherwise fetches the first page. Redirects to the lookup page on error.
 */

import { enqueueSnackbar } from "notistack";
import { InfiniteData } from "@tanstack/react-query";
import { LoaderFunctionArgs, redirect } from "react-router-dom";
import { LOOKUP_PAGE_PATH } from "@app/core/constants/pathConstants";
import { resolveUserHandle } from "@app/features/userProfile/loaders";
import { PAGE_SIZE_LIMITS, INITIAL_PAGE_PARAM } from "@app/core/constants/ParamsConstants";
import {
    ApiError,
    queryClient,
    threadsApi,
    THREADS_KEYS,
    Thread,
    ThreadListResponse,
    UsersParamsWithUserName,
} from "@app/core/services";

/**
 * Data shape provided to the route element after a successful load.
 * @property threads The first page of the user's visible threads, flattened.
 * @property params Query parameters the tab must keep using, so its hook hits the same cache key.
 */
export interface UserProfileThreadsContext {
    threads: Thread[];
    params: UsersParamsWithUserName;
}

/**
 * Resolves another user's threads for the default tab of their profile.
 *
 * Errors redirect to the lookup page rather than back to the profile, which is this very route and
 * would re-run this loader.
 *
 * All errors are handled internally; no exceptions are thrown outward.
 *
 * @param {LoaderFunctionArgs} args Loader arguments carrying the `:userName` route param.
 * @returns {Promise<UserProfileThreadsContext | Response>} The threads context, or a redirect response.
 */
export const userThreadsLoader = async ({
    params: routeParams,
}: LoaderFunctionArgs): Promise<UserProfileThreadsContext | Response> => {
    const userName: string | null = resolveUserHandle(routeParams.userName);

    if (!userName) {
        return redirect(LOOKUP_PAGE_PATH);
    }

    const params: UsersParamsWithUserName = { userName, limit: PAGE_SIZE_LIMITS.DEFAULT };

    // Check cache first
    const cachedData = queryClient.getQueryData<InfiniteData<ThreadListResponse>>(THREADS_KEYS.userList(params));

    if (cachedData) {
        const threads: Thread[] = cachedData.pages.flatMap((page: ThreadListResponse): Thread[] => page.data);
        return { threads, params };
    }

    try {
        const infiniteData = await queryClient.fetchInfiniteQuery({
            queryKey: THREADS_KEYS.userList(params),
            queryFn: ({ pageParam }): Promise<ThreadListResponse> =>
                threadsApi.getUserThreads({ ...params, page: pageParam }),
            initialPageParam: INITIAL_PAGE_PARAM,
        });
        const threads: Thread[] = infiniteData.pages.flatMap((page: ThreadListResponse): Thread[] => page.data);
        return { threads, params };
    } catch (error) {
        enqueueSnackbar((error as ApiError)?.message, { variant: "error" });
        return redirect(LOOKUP_PAGE_PATH);
    }
};
