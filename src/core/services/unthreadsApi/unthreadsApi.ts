import { UNTHREADS_API_ROOT } from "@app/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const PROFILE_TAG = "ProfileTag";
export const SESSIONS_TAG = "SessionsTag";
export const USER_TAG = "UserTag";

export const TAG_TYPES = [PROFILE_TAG, SESSIONS_TAG, USER_TAG];

export const unthreadsApi = createApi({
    reducerPath: "console",
    tagTypes: TAG_TYPES,
    baseQuery: fetchBaseQuery({
        baseUrl: `${UNTHREADS_API_ROOT}/v1/`,
        credentials: "include",
    }),
    endpoints: () => ({}),
});
