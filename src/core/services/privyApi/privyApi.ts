import { PRIVY_API_ROOT } from "@app/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const PROFILE_TAG = "ProfileTag";
export const TAG_TAG = "Tag";
export const PROFILE_PHOTOS_TAG = "ProfilePhotosTag";
export const SESSIONS_TAG = "SessionsTag";
export const USER_NAME_TAG = "UserNameTag";
export const USER_TAG = "UserTag";

export const TAG_TYPES = [PROFILE_TAG, SESSIONS_TAG, USER_TAG, USER_NAME_TAG, PROFILE_PHOTOS_TAG, TAG_TAG] as const;

export const privyApi = createApi({
    reducerPath: "console",
    tagTypes: TAG_TYPES,
    baseQuery: fetchBaseQuery({
        baseUrl: `${PRIVY_API_ROOT}/v1/`,
        credentials: "include",
    }),
    endpoints: () => ({}),
});
