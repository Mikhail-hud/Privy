import { store } from "@app/core/store";
import { redirect } from "react-router-dom";
import { authApi } from "@app/core/services";
import { PROFILE_PAGE_PATH } from "@app/core/constants/pathConstants";

/**
 * Loader function to restrict access to guest-only routes.
 *
 * This function checks if the user is authenticated by querying the Redux store
 * for the result of the "me" endpoint from the auth API. If the user is authenticated,
 * they are redirected to the profile page. Otherwise, the route is accessible.
 *
 * @returns {Promise<Promise<Response> | null>} A redirect response to the profile page if the user is authenticated, or null if the user is not authenticated.
 */
export const publicRoutesLoader = async (): Promise<Promise<Response> | null> => {
    // Retrieve the current state of the Redux store
    const state = store.getState();

    // Select the result of the "me" endpoint from the auth API
    const result = authApi.endpoints.me.select()(state);

    // If the user is authenticated (a result is successful), redirect to the profile page
    if (result.isSuccess) {
        return redirect(PROFILE_PAGE_PATH);
    }

    // If the user is not authenticated, allow access to the guest-only route
    return null;
};
