import { PRIVY_API_ROOT } from "@app/config";
import { GENERIC_ERROR_MESSAGE } from "@app/core/constants/general";
import axios, { AxiosInstance, AxiosRequestConfig, isAxiosError } from "axios";

export interface ApiError {
    message: string;
    errors?: Record<string, string>;
    statusCode: number;
    timestamp: string;
    path: string;
}
export interface RequestConfig {
    url: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    params?: Record<string, string | number | undefined>;
}

const axiosInstance: AxiosInstance = axios.create({
    baseURL: `${PRIVY_API_ROOT}/v1/`,
    withCredentials: true,
});

export class ApiClientError extends Error {
    public statusCode: number;
    public timestamp: string;
    public path: string;
    public errors?: Record<string, string>;

    constructor(data: ApiError) {
        const messageString: string = Array.isArray(data.message) ? data.message.join(", ") : data.message;
        super(messageString);
        this.statusCode = data.statusCode;
        this.timestamp = data.timestamp;
        this.path = data.path;
        this.errors = data.errors;
    }
}

export async function apiClient<T>(config: RequestConfig): Promise<T> {
    const { url, method = "GET", body, params } = config;

    const axiosConfig: AxiosRequestConfig = {
        url,
        method,
        params,
        data: body,
    };

    try {
        const response = await axiosInstance.request<T>(axiosConfig);
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response?.data) {
            const data = error.response.data as ApiError;
            throw new ApiClientError(data);
        }

        throw new ApiClientError({
            message: GENERIC_ERROR_MESSAGE,
            statusCode: 500,
            timestamp: new Date().toISOString(),
            path: config.url,
        });
    }
}
