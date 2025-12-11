import { redirect } from "react-router-dom";
import { AUTH_KEYS, Profile, queryClient } from "@app/core/services";
import { PROFILE_PAGE_PATH } from "@app/core/constants/pathConstants";

/**
 * Loader for guest-only routes.
 *
 * Checks if the user is authenticated by retrieving cached profile data.
 * - If authenticated, redirects to the profile page.
 * - If not authenticated, allows access to the route.
 *
 * @returns {Response | null} Redirect response if authenticated, otherwise null.
 */
export const publicRoutesLoader = (): Response | null => {
    const cachedUser: Profile | undefined = queryClient.getQueryData<Profile>(AUTH_KEYS.me());

    if (cachedUser) {
        return redirect(PROFILE_PAGE_PATH);
    }

    return null;
};
