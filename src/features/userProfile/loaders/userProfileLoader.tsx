/**
 * Loader for user profiles, used in profile features.
 * Fetches a user profile from the cache if available, otherwise dispatches an API call.
 * Redirects to the lookup page on error or invalid username.
 * @file src/features/userProfile/loaders/userProfileLoader.tsx
 */

import { store } from "@app/core/store";
import { enqueueSnackbar } from "notistack";
import { QueryError } from "@app/core/interfaces";
import { usersApi, User } from "@app/core/services";
import { LoaderFunctionArgs, redirect } from "react-router-dom";
import { GENERIC_ERROR_MESSAGE } from "@app/core/constants/general.ts";
import { LOOKUP_PAGE_PATH, USER_HANDLE_PREFIX } from "@app/core/constants/pathConstants";

/**
 * User profile context made available to route elements.
 * @property user The loaded user object.
 * @property userName The username without prefix.
 */
export interface UserProfileLoaderData {
    user: User;
    userName: string;
}

/**
 * React Router loader that resolves the current user profile for profile routes.
 *
 * Flow:
 * 1. Validates the `userName` param and strips the prefix.
 * 2. Dispatches `usersApi.endpoints.getUserProfile.initiate()` to fetch the user profile.
 * 3. On success returns `{ user, userName }`.
 * 4. On failure (e.g., network error, invalid username) returns a redirect `Response` to the lookup page.
 * 5. Always unsubscribes the initiated query subscription in `finally` to prevent leaks.
 *
 * No errors are thrown outward: failures are normalized into a redirect.
 *
 * @param {LoaderFunctionArgs} args Loader function arguments containing route params.
 * @returns {Promise<UserProfileLoaderData | Response>} Resolves with user profile context or a redirect response.
 *
 * @example
 * // In a route definition: src/core/app/App.tsx
 * {
 *   path: USER_PROFILE_PATH,
 *   loader: userProfileLoader,
 *   element: <UserProfile />,
 * },
 */
export const userProfileLoader = async ({ params }: LoaderFunctionArgs): Promise<UserProfileLoaderData | Response> => {
    const { userName } = params;

    if (!userName || !userName.startsWith(USER_HANDLE_PREFIX)) {
        return redirect(LOOKUP_PAGE_PATH);
    }
    const planedUserName: string = userName.replace(new RegExp(`^${USER_HANDLE_PREFIX}`), "");
    const promise = store.dispatch(
        usersApi.endpoints.getUserProfile.initiate({
            userName: planedUserName,
        })
    );

    try {
        const user: User = await promise.unwrap();
        return { user, userName: planedUserName };
    } catch (error) {
        const errorMessage: string = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
        enqueueSnackbar(errorMessage, { variant: "error" });
        return redirect(LOOKUP_PAGE_PATH);
    } finally {
        promise.unsubscribe();
    }
};
