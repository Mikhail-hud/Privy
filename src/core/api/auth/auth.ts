import axios from "axios";
import { User } from "@app/core/services";
import { UNTHREADS_API_ROOT } from "@app/config";

export interface SignInPayload {
    identifier: string;
    password: string;
    rememberMe?: boolean;
}

const axiosInstance = axios.create({
    baseURL: `${UNTHREADS_API_ROOT}/v1/`,
    withCredentials: true,
});

export const authAPI = {
    signIn: async ({ password, rememberMe = false, identifier }: SignInPayload): Promise<User> => {
        const response = await axiosInstance.post(`auth/sign-in`, { identifier, password, rememberMe });
        return response.data;
    },
    me: async (): Promise<User> => {
        const response = await axiosInstance.get(`auth/me`);
        return response.data;
    },
    signOut: async (): Promise<void> => {
        await axiosInstance.post(`auth/sign-out`);
    },
};
