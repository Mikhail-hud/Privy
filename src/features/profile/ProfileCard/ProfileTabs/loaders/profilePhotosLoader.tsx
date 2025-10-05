/**
 * Loader for profile photos, used in profile tabs.
 * Fetches photos from the cache if available, otherwise dispatches an API call.
 * Redirects to the profile page on error.
 * @file src/features/profile/ProfileCard/ProfileTabs/loaders/profilePhotosLoader.tsx
 */

import { store } from "@app/core/store";
import { redirect } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { QueryError } from "@app/core/interfaces";
import { Photo, profileApi } from "@app/core/services";
import { PROFILE_PAGE_PATH } from "@app/core/constants/pathConstants";
import { GENERIC_ERROR_MESSAGE } from "@app/core/constants/general.ts";

/**
 * User photos context made available to route elements.
 * @property photos Array of user photos returned by the `getProfilePhotos` endpoint.
 */
export interface UserPhotosContext {
    photos: Photo[];
}

/**
 * React Router loader that resolves the current user's profile photos for profile tab routes.
 *
 * Flow:
 * 1. Reads cached `getProfilePhotos` a query result from the Redux store (RTK Query selector).
 * 2. If the cached query is successful, returns the photos without a network request.
 * 3. Otherwise, dispatches `profileApi.endpoints.getProfilePhotos.initiate()` to fetch photos.
 * 4. On success returns `{ photos }`.
 * 5. On failure (e.g., network error) returns a redirect `Response` to the profile page.
 * 6. Always unsubscribes the initiated query subscription in `finally` to prevent leaks.
 *
 * No errors are thrown outward: failures are normalized into a redirect.
 *
 * @returns {Promise<UserPhotosContext | Response>} Resolves with user photos context or a redirect response.
 *
 * @example
 * // In a route definition: src/core/app/App.tsx
 * {
 *   path: PROFILE_PHOTOS_TAB_PATH,
 *   loader: profilePhotosLoader,
 *   element: <ProfilePhotos />,
 *   handle: { tab: PROFILE_PHOTOS_TAB_PATH },
 * },
 */
export const profilePhotosLoader = async (): Promise<UserPhotosContext | Response> => {
    const photosInCache = profileApi.endpoints.getProfilePhotos.select()(store.getState());

    if (photosInCache.isSuccess) return { photos: photosInCache.data };

    const promise = store.dispatch(profileApi.endpoints.getProfilePhotos.initiate());

    try {
        const photos: Photo[] = await promise.unwrap();
        return { photos };
    } catch (error) {
        const errorMessage = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
        enqueueSnackbar(errorMessage, { variant: "error" });
        return redirect(PROFILE_PAGE_PATH);
    } finally {
        promise.unsubscribe();
    }
};
