/**
 * Ensures an authenticated user is available before rendering protected layout routes.
 * Wrap this loader in route definitions that require a signed-in user. Returns either a
 * `UserContext` (on success) or a redirect `Response` to the sign-in page (on failure).
 * @file src/features/auth/loaders/appLayoutLoader.tsx
 */

import { store } from "@app/core/store";
import { redirect } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { authApi, Profile } from "@app/core/services";
import { QueryError } from "@app/core/interfaces";
import { SIGN_IN_PAGE_PATH } from "@app/core/constants/pathConstants";
import { GENERIC_ERROR_MESSAGE } from "@app/core/constants/general.ts";

/**
 * Authenticated user context made available to route elements.
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
 * 2. If the cached query is successful, returns the user without a network request.
 * 3. Otherwise, dispatches `authApi.endpoints.me.initiate()` to fetch the user.
 * 4. On success returns `{ user }`.
 * 5. On failure (e.g., 401 / network error) returns a redirect `Response` to the sign-in page.
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
    const userInCache = authApi.endpoints.me.select()(store.getState());

    if (userInCache.isSuccess) return { user: userInCache.data };

    const promise = store.dispatch(authApi.endpoints.me.initiate());

    try {
        const user: Profile = await promise.unwrap();
        return { user };
    } catch (error) {
        const errorMessage = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
        enqueueSnackbar(errorMessage, { variant: "error" });
        return redirect(SIGN_IN_PAGE_PATH);
    } finally {
        promise.unsubscribe();
    }
};
