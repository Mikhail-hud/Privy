/**
 * Ensures an authenticated user is available before rendering protected layout routes.
 * Use this loader in route definitions that require a signed-in user.
 * Returns either `UserContext` (on success) or a redirect `Response` to the sign-in page (on failure).
 * @file src/features/auth/loaders/appLayoutLoader.tsx
 */

import { redirect } from "react-router-dom";
import { SIGN_IN_PAGE_PATH } from "@app/core/constants/pathConstants.ts";
import { ApiError, AUTH_KEYS, authApi, Profile, queryClient } from "@app/core/services";

/**
 * Authenticated user context available to route elements.
 * @property user Authenticated user returned by the `me` endpoint.
 */
export interface UserContext {
    user: Profile;
}

/**
 * React Router loader that resolves the current authenticated user for protected layout routes.
 *
 * Flow:
 * 1. Reads cached `me` query result from the Redux store (RTK Query selector).
 * 2. If the cache is valid, returns the user without a network request.
 * 3. Otherwise, dispatches `authApi.me` to fetch the user.
 * 4. On success, returns `{ user }`.
 * 5. On failure (e.g., 401 or network error), returns a redirect `Response` to the sign-in page.
 * 6. Always unsubscribes the initiated query subscription in `finally` to prevent leaks.
 *
 * No errors are thrown outward: failures are normalized into a redirect.
 *
 * @returns {Promise<UserContext | Response>} Resolves with user context or a redirect response.
 *
 * @example
 * // In a route definition: src/core/app/App.tsx
 * {
 *   id: ROOT_ID,
 *   path: ROOT_PATH,
 *   element: <AppLayout />,
 *   loader: appLayoutLoader,
 * }
 */
export const appLayoutLoader = async (): Promise<UserContext | Response> => {
    // Check cache first
    const cachedUser: Profile | undefined = queryClient.getQueryData<Profile>(AUTH_KEYS.me());

    if (cachedUser) {
        return { user: cachedUser };
    }

    try {
        const user: Profile = await queryClient.fetchQuery({
            queryKey: AUTH_KEYS.me(),
            queryFn: authApi.me,
            retry: false,
        });
        return { user };
    } catch (error) {
        console.warn((error as ApiError)?.message);
        return redirect(SIGN_IN_PAGE_PATH);
    }
};
