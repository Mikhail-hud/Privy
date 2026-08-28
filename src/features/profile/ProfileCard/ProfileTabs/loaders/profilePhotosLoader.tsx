/**
 * @file src/features/profile/ProfileCard/ProfileTabs/loaders/profilePhotosLoader.tsx
 * React Router loader for profile photos in profile tabs. Fetches photos from cache if available,
 * otherwise dispatches an API call. Redirects to the profile page on error.
 */

import { redirect } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { InfiniteData } from "@tanstack/react-query";
import { PROFILE_PAGE_PATH } from "@app/core/constants/pathConstants";
import { PAGE_SIZE_LIMITS, INITIAL_PAGE_PARAM } from "@app/core/constants/ParamsConstants";
import {
    Photo,
    profileApi,
    queryClient,
    PROFILE_KEYS,
    ApiError,
    PhotoListResponse,
    PhotoQueryParams,
} from "@app/core/services";

/**
 * Data shape provided to route elements after successful photo load.
 * @property photos Array of user photos returned by the `getProfilePhotos` endpoint.
 * @property params Query parameters used for fetching photos.
 */
export interface UserPhotosContext {
    photos: Photo[];
    params: PhotoQueryParams;
}

/**
 * React Router loader for resolving the current user's profile photos in profile tab routes.
 *
 * Flow:
 * 1. Checks cache for the profile photos infinite query result.
 * 2. If cached, returns the flattened photos.
 * 3. Otherwise, fetches the first page of photos via the API.
 * 4. On success, returns `{ photos, params }`.
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
    const params: PhotoQueryParams = { limit: PAGE_SIZE_LIMITS.DEFAULT };

    // Check cache first
    const cachedData = queryClient.getQueryData<InfiniteData<PhotoListResponse>>(PROFILE_KEYS.photos(params));

    if (cachedData) {
        const photos: Photo[] = cachedData.pages.flatMap(page => page.data);
        return { photos, params };
    }

    try {
        const infiniteData = await queryClient.fetchInfiniteQuery({
            queryKey: PROFILE_KEYS.photos(params),
            queryFn: ({ pageParam }): Promise<PhotoListResponse> =>
                profileApi.getProfilePhotos({ ...params, page: pageParam }),
            initialPageParam: INITIAL_PAGE_PARAM,
        });
        const photos: Photo[] = infiniteData.pages.flatMap(page => page.data);
        return { photos, params };
    } catch (error) {
        enqueueSnackbar((error as ApiError)?.message, { variant: "error" });
        return redirect(PROFILE_PAGE_PATH);
    }
};
