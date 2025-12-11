/**
 * @file src/features/profile/ProfileCard/ProfileTabs/loaders/profilePhotosLoader.tsx
 * React Router loader for profile photos in profile tabs. Fetches photos from cache if available,
 * otherwise dispatches an API call. Redirects to the profile page on error.
 */

import { redirect } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { PROFILE_PAGE_PATH } from "@app/core/constants/pathConstants";
import { Photo, profileApi, queryClient, PROFILE_KEYS, ApiError } from "@app/core/services";

/**
 * Data shape provided to route elements after successful photo load.
 * @property photos Array of user photos returned by the `getProfilePhotos` endpoint.
 */
export interface UserPhotosContext {
    photos: Photo[];
}

/**
 * React Router loader for resolving the current user's profile photos in profile tab routes.
 *
 * Flow:
 * 1. Checks cache for profile photos.
 * 2. If cached, returns the photos.
 * 3. Otherwise, fetches photos via API.
 * 4. On success, returns `{ photos }`.
 * 5. On failure (network error), shows an error notification and redirects to the profile page.
 *
 * All errors are handled internally; no exceptions are thrown outward.
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
    // Check cache first
    const cachedPhotos: Photo[] | undefined = queryClient.getQueryData<Photo[]>(PROFILE_KEYS.photos());
    if (cachedPhotos) {
        return { photos: cachedPhotos };
    }

    try {
        const photos: Photo[] = await queryClient.fetchQuery({
            queryKey: PROFILE_KEYS.photos(),
            queryFn: profileApi.getProfilePhotos,
        });
        return { photos };
    } catch (error) {
        enqueueSnackbar((error as ApiError)?.message, { variant: "error" });
        return redirect(PROFILE_PAGE_PATH);
    }
};
