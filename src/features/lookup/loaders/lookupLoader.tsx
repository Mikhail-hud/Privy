/**
 * Loader for user lists, used in lookup features.
 * Fetches users from the cache if available, otherwise dispatches an API call.
 * Redirects to the profile page on error.
 * @file src/features/lookup/loaders/lookupLoader.tsx
 */

import { redirect } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { InfiniteData } from "@tanstack/react-query";
import { PROFILE_PAGE_PATH } from "@app/core/constants/pathConstants";
import { PAGE_SIZE_LIMITS, INITIAL_PAGE_PARAM } from "@app/core/constants/ParamsConstants.ts";
import { QueryParams, User, UserListResponse, usersApi, queryClient, USERS_KEYS, ApiError } from "@app/core/services";

/**
 * User list context made available to route elements.
 * @property users Array of users returned by the `getUsers` endpoint.
 */
export interface UsersContext {
    users: User[];
    params: QueryParams;
}

/**
 * React Router loader that resolves the current user list for lookup routes.
 *
 * Flow:
 * 1. Reads cached `getUsers` query result from the Redux store (RTK Query selector).
 * 2. If the cached query is successful, returns the users without a network request.
 * 3. Otherwise, dispatches `usersApi.endpoints.getUsers.initiate()` to fetch users.
 * 4. On success returns `{ users, params }`.
 * 5. On failure (e.g., network error) returns a redirect `Response` to the profile page.
 * 6. Always unsubscribes the initiated query subscription in `finally` to prevent leaks.
 *
 * No errors are thrown outward: failures are normalized into a redirect.
 *
 * @returns {Promise<UsersContext | Response>} Resolves with user list context or a redirect response.
 *
 * @example
 * // In a route definition: src/core/app/App.tsx
 * {
 *   path: LOOKUP_USERS_PATH,
 *   loader: lookupLoader,
 *   element: <UserList />,
 * },
 */
export const lookupLoader = async (): Promise<UsersContext | Response> => {
    const params = { query: "", limit: PAGE_SIZE_LIMITS.DEFAULT };

    // Check cache first
    const cachedData = queryClient.getQueryData<InfiniteData<UserListResponse>>(USERS_KEYS.list(params));
    if (cachedData) {
        const users: User[] = cachedData.pages.flatMap(page => page.data);
        return { users, params };
    }

    try {
        const infiniteData = await queryClient.fetchInfiniteQuery({
            queryKey: USERS_KEYS.list(params),
            queryFn: ({ pageParam }): Promise<UserListResponse> => usersApi.getUsers({ ...params, page: pageParam }),
            initialPageParam: INITIAL_PAGE_PARAM,
        });
        const users: User[] = infiniteData.pages.flatMap(page => page.data);
        return { users, params };
    } catch (error) {
        const errorMessage: string = (error as ApiError)?.message;
        enqueueSnackbar(errorMessage, { variant: "error" });
        return redirect(PROFILE_PAGE_PATH);
    }
};
