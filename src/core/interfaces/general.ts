import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export interface ApiError {
    message: string;
    errors?: Record<string, string>;
    statusCode: number;
    timestamp: string;
    path: string;
}

export type QueryError = FetchBaseQueryError & { data?: ApiError };
