import { store } from "@app/core/store";
import { redirect } from "react-router-dom";
import { SIGN_IN_PAGE_PATH } from "@app/core/constants/pathConstants";
import { authApi, Profile, profileApi, User } from "@app/core/services";

export interface UserContext {
    user: User;
    profile: Profile;
}

/**
 * Loader function for the application layout.
 *
 * This function ensures that the user and profile data are available before rendering the application layout.
 * It first checks if the data is already cached in the Redux store. If the data is cached, it returns the user and profile.
 * Otherwise, it dispatches API calls to fetch the data. If the API calls fail, the user is redirected to the sign-in page.
 *
 * @returns {Promise<UserContext | Response>} An object containing the user and profile data if successful, or a redirect response to the sign-in page if the API calls fail.
 */
export const appLayoutLoader = async (): Promise<UserContext | Response> => {
    // Check if user and profile data are already cached in the Redux store
    const userInCache = authApi.endpoints.me.select()(store.getState());
    const profileInCache = profileApi.endpoints.getProfile.select()(store.getState());

    // If both user and profile data are cached, return them
    if (userInCache.isSuccess && profileInCache.isSuccess) {
        return { user: userInCache.data, profile: profileInCache.data };
    }

    // Dispatch API calls to fetch user and profile data
    const mePromise = store.dispatch(authApi.endpoints.me.initiate());
    const profilePromise = store.dispatch(profileApi.endpoints.getProfile.initiate());

    try {
        // Wait for both API calls to resolve
        const [user, profile] = await Promise.all([mePromise.unwrap(), profilePromise.unwrap()]);
        return { user, profile };
    } catch (error) {
        // Redirect to the sign-in page if the API calls fail
        return redirect(SIGN_IN_PAGE_PATH);
    } finally {
        // Unsubscribe from the API calls to clean up resources
        mePromise.unsubscribe();
        profilePromise.unsubscribe();
    }
};
