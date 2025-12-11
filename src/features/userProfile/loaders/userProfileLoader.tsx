/**
 * @file src/features/userProfile/loaders/userProfileLoader.tsx
 * React Router loader for user profiles. Fetches a user profile from cache if available,
 * otherwise dispatches an API call. Redirects to the lookup page on error or invalid username.
 */

import { enqueueSnackbar } from "notistack";
import { LoaderFunctionArgs, redirect } from "react-router-dom";
import { usersApi, User, queryClient, USERS_KEYS, ApiError } from "@app/core/services";
import { LOOKUP_PAGE_PATH, USER_HANDLE_PREFIX } from "@app/core/constants/pathConstants";

/**
 * Data shape provided to route elements after successful profile load.
 * @property user The loaded user object.
 * @property userName The username without prefix.
 */
export interface UserProfileLoaderData {
    user: User;
    userName: string;
}

/**
 * React Router loader for resolving the current user profile in profile routes.
 *
 * Flow:
 * 1. Validates the `userName` param and strips the prefix.
 * 2. Checks cache for the user profile.
 * 3. If not cached, fetches the user profile via API.
 * 4. On success, returns `{ user, userName }`.
 * 5. On failure (network error, invalid username), shows an error notification and redirects to the lookup page.
 *
 * All errors are handled internally; no exceptions are thrown outward.
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

    // Check cache first
    const cachedUser: User | undefined = queryClient.getQueryData<User>(USERS_KEYS.profile(planedUserName));
    if (cachedUser) {
        return { user: cachedUser, userName: planedUserName };
    }

    try {
        const user: User = await queryClient.fetchQuery({
            queryKey: USERS_KEYS.profile(planedUserName),
            queryFn: (): Promise<User> => usersApi.getUserProfile(planedUserName),
        });
        return { user, userName: planedUserName };
    } catch (error) {
        const errorMessage: string = (error as ApiError)?.message;
        enqueueSnackbar(errorMessage, { variant: "error" });
        return redirect(LOOKUP_PAGE_PATH);
    }
};
