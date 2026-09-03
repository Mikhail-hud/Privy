/**
 * @file src/features/userProfile/UserProfileCard/UserProfileTabs/loaders/userPhotosLoader.tsx
 * React Router loader for another user's photos tab. Serves the infinite query from cache when it is
 * already there, otherwise fetches the first page. Redirects back to the profile on error.
 */

import { enqueueSnackbar } from "notistack";
import { InfiniteData } from "@tanstack/react-query";
import { LoaderFunctionArgs, redirect } from "react-router-dom";
import { resolveUserHandle } from "@app/features/userProfile/loaders";
import { PAGE_SIZE_LIMITS, INITIAL_PAGE_PARAM } from "@app/core/constants/ParamsConstants";
import { LOOKUP_PAGE_PATH, userProfilePath } from "@app/core/constants/pathConstants";
import {
    ApiError,
    Photo,
    PhotoListResponse,
    queryClient,
    usersApi,
    USERS_KEYS,
    UserPhotosParams,
} from "@app/core/services";

/**
 * Data shape provided to the route element after a successful load.
 * @property photos The first page of the user's visible photos, flattened.
 * @property params Query parameters the tab must keep using, so its hook hits the same cache key.
 */
export interface UserProfilePhotosContext {
    photos: Photo[];
    params: UserPhotosParams;
}

/**
 * Resolves another user's photos for the photos tab of their profile.
 *
 * All errors are handled internally; no exceptions are thrown outward.
 *
 * @param {LoaderFunctionArgs} args Loader arguments carrying the `:userName` route param.
 * @returns {Promise<UserProfilePhotosContext | Response>} The photos context, or a redirect response.
 */
export const userPhotosLoader = async ({
    params: routeParams,
}: LoaderFunctionArgs): Promise<UserProfilePhotosContext | Response> => {
    const userName: string | null = resolveUserHandle(routeParams.userName);

    if (!userName) {
        return redirect(LOOKUP_PAGE_PATH);
    }

    const params: UserPhotosParams = { userName, limit: PAGE_SIZE_LIMITS.DEFAULT };

    // Check cache first
    const cachedData = queryClient.getQueryData<InfiniteData<PhotoListResponse>>(USERS_KEYS.photos(params));

    if (cachedData) {
        const photos: Photo[] = cachedData.pages.flatMap((page: PhotoListResponse): Photo[] => page.data);
        return { photos, params };
    }

    try {
        const infiniteData = await queryClient.fetchInfiniteQuery({
            queryKey: USERS_KEYS.photos(params),
            queryFn: ({ pageParam }): Promise<PhotoListResponse> =>
                usersApi.getUserPhotos({ ...params, page: pageParam }),
            initialPageParam: INITIAL_PAGE_PARAM,
        });
        const photos: Photo[] = infiniteData.pages.flatMap((page: PhotoListResponse): Photo[] => page.data);
        return { photos, params };
    } catch (error) {
        enqueueSnackbar((error as ApiError)?.message, { variant: "error" });
        // Back to the profile itself, which is a different route than this one and so cannot loop.
        return redirect(userProfilePath(routeParams.userName as string));
    }
};
