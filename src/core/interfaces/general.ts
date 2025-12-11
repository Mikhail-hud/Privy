import { ApiError } from "@app/core/services";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

// Legacy RTK Query error type
export type QueryError = FetchBaseQueryError & { data?: ApiError };
