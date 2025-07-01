import { UNTHREADS_API_ROOT } from "@app/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const PROFILE_TAG = "ProfileTag";
export const SESSIONS_TAG = "SessionsTag";

export const unthreadsApi = createApi({
    reducerPath: "console",
    tagTypes: [SESSIONS_TAG, PROFILE_TAG],
    baseQuery: fetchBaseQuery({
        baseUrl: `${UNTHREADS_API_ROOT}/v1/`,
        credentials: "include",
    }),
    endpoints: () => ({}),
});
