import {
    useQuery,
    useMutation,
    UseQueryOptions,
    UseMutationOptions,
    UseMutationResult,
    UseQueryResult,
} from "@tanstack/react-query";
import { Profile, PROFILE_KEYS, queryClient, apiClient } from "@app/core/services";

export interface SignInPayload {
    identifier: string;
    password: string;
    rememberMe?: boolean;
}

export interface SignUpPayload {
    userName: string;
    email: string;
    password: string;
    passwordRepeat: string;
    age: number;
    gender?: UserGender;
    fullName?: string;
    biography?: string;
    rememberMe?: boolean;
}

export interface TwoFactorSignInPayload {
    twoFactorCode: string;
}

export interface UserNameAvailabilityPayload {
    userName: string;
}

export interface UserNameAvailabilityResponse {
    isAvailable: boolean;
}

export interface Session {
    id: number;
    userId: number;
    expiresAt: string;
    createdAt: string;
    userAgent: string;
    revoked: boolean;
    rememberMe: boolean;
    ip: string;
    isCurrent: boolean;
}

export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN",
    MODERATOR = "MODERATOR",
}

export enum UserGender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER",
}

export interface TwoFactorStatus {
    twoFactorRequired: boolean;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    password: string;
    passwordRepeat: string;
}

export interface ResetPasswordPayload {
    email: string;
}

export interface NewPasswordPayload {
    token: string;
    password: string;
    passwordRepeat: string;
}

export const AUTH_KEYS = {
    all: ["auth"] as const,
    me: () => [...AUTH_KEYS.all, "me"] as const,
    sessions: () => [...AUTH_KEYS.all, "sessions"] as const,
    userNameAvailability: (userName: string) => [...AUTH_KEYS.all, "userNameAvailability", userName] as const,
};

export const authApi = {
    me: async (): Promise<Profile> => {
        const profile: Profile = await apiClient<Profile>({ url: "auth/me" });
        // Sync user in the profile cache as well
        // Used in appLayoutLoader to preload profile data
        queryClient.setQueryData(PROFILE_KEYS.getProfile(), profile);
        return profile;
    },

    signIn: async (payload: SignInPayload): Promise<TwoFactorStatus | Profile> => {
        const response: Profile | TwoFactorStatus = await apiClient<TwoFactorStatus | Profile>({
            url: "auth/sign-in",
            method: "POST",
            body: payload,
        });
        // if two-factor is required, do not sync user in cache
        if ("twoFactorRequired" in response) return response;
        // Sync user in the cache
        queryClient.setQueryData(AUTH_KEYS.me(), response);
        queryClient.setQueryData(PROFILE_KEYS.getProfile(), response);
        return response;
    },

    signUp: async (payload: SignUpPayload): Promise<Profile> => {
        const profile: Profile = await apiClient<Profile>({
            url: "auth/sign-up",
            method: "POST",
            body: payload,
        });
        // Sync user in the cache
        queryClient.setQueryData(AUTH_KEYS.me(), profile);
        queryClient.setQueryData(PROFILE_KEYS.getProfile(), profile);
        return profile;
    },

    twoFactorSignIn: async (payload: TwoFactorSignInPayload): Promise<Profile> => {
        const profile: Profile = await apiClient<Profile>({
            url: "auth/sign-in/two-factor",
            method: "POST",
            body: payload,
        });
        // Sync user in the cache
        queryClient.setQueryData(AUTH_KEYS.me(), profile);
        queryClient.setQueryData(PROFILE_KEYS.getProfile(), profile);
        return profile;
    },

    signOut: async (): Promise<void> => {
        await apiClient<void>({
            url: "auth/sign-out",
            method: "POST",
        });
        // Clear ALL Application Cache on Sign Out
        queryClient.clear();
    },

    checkUserNameAvailability: async (payload: UserNameAvailabilityPayload): Promise<UserNameAvailabilityResponse> => {
        return apiClient<UserNameAvailabilityResponse>({
            url: "auth/user-name/availability",
            method: "GET",
            params: { userName: payload.userName },
        });
    },

    getSessions: async (): Promise<Session[]> => {
        return apiClient<Session[]>({ url: "auth/sessions" });
    },

    revokeSession: async (id: number): Promise<void> => {
        await apiClient<void>({
            url: `auth/sessions/${id}`,
            method: "DELETE",
        });
        queryClient.invalidateQueries({ queryKey: AUTH_KEYS.sessions() });
    },

    revokeAllSessions: async (): Promise<void> => {
        await apiClient<void>({
            url: "auth/sessions/revoke-all",
            method: "POST",
        });
        queryClient.invalidateQueries({ queryKey: AUTH_KEYS.sessions() });
    },

    changePassword: async (payload: ChangePasswordPayload): Promise<void> => {
        await apiClient<void>({
            url: "auth/change-password",
            method: "POST",
            body: payload,
        });
        // Change password revokes all sessions except the current one
        queryClient.invalidateQueries({ queryKey: AUTH_KEYS.sessions() });
    },

    resetPassword: async (payload: ResetPasswordPayload): Promise<void> => {
        await apiClient<void>({
            url: "auth/password-recovery/reset",
            method: "POST",
            body: payload,
        });
        // Clear ALL Application Cache on Sign Out
        queryClient.clear();
    },

    setNewPassword: async (payload: NewPasswordPayload): Promise<void> => {
        await apiClient<void>({
            url: "auth/password-recovery/new-password",
            method: "POST",
            body: payload,
        });
        // Clear ALL Application Cache on Sign Out
        queryClient.clear();
    },
};

export const useSignInMutation = (
    options?: UseMutationOptions<TwoFactorStatus | Profile, Error, SignInPayload>
): UseMutationResult<TwoFactorStatus | Profile, Error, SignInPayload> => {
    return useMutation({
        mutationFn: authApi.signIn,
        ...options,
    });
};

export const useSignUpMutation = (
    options?: UseMutationOptions<Profile, Error, SignUpPayload>
): UseMutationResult<Profile, Error, SignUpPayload> => {
    return useMutation({
        mutationFn: authApi.signUp,
        ...options,
    });
};

export const useTwoFactorSignInMutation = (
    options?: UseMutationOptions<Profile, Error, TwoFactorSignInPayload>
): UseMutationResult<Profile, Error, TwoFactorSignInPayload> => {
    return useMutation({
        mutationFn: authApi.twoFactorSignIn,
        ...options,
    });
};

export const useSignOutMutation = (
    options?: UseMutationOptions<void, Error, void>
): UseMutationResult<void, Error, void> => {
    return useMutation({
        mutationFn: authApi.signOut,
        ...options,
    });
};

export const useLazyCheckUserNameAvailabilityQuery = (): UseMutationResult<
    UserNameAvailabilityResponse,
    Error,
    UserNameAvailabilityPayload
> => {
    return useMutation({
        mutationFn: authApi.checkUserNameAvailability,
    });
};

export const useGetSessionsQuery = (
    options?: Omit<UseQueryOptions<Session[]>, "queryKey" | "queryFn">
): UseQueryResult<Session[], Error> => {
    return useQuery({
        queryKey: AUTH_KEYS.sessions(),
        queryFn: authApi.getSessions,
        ...options,
    });
};

export const useRevokeSessionMutation = (
    options?: UseMutationOptions<void, Error, number>
): UseMutationResult<void, Error, number> => {
    return useMutation({
        mutationFn: authApi.revokeSession,
        ...options,
    });
};

export const useRevokeAllSessionsMutation = (
    options?: UseMutationOptions<void, Error, void>
): UseMutationResult<void, Error, void> => {
    return useMutation({
        mutationFn: authApi.revokeAllSessions,
        ...options,
    });
};

export const useChangePasswordMutation = (
    options?: UseMutationOptions<void, Error, ChangePasswordPayload>
): UseMutationResult<void, Error, ChangePasswordPayload> => {
    return useMutation({
        mutationFn: authApi.changePassword,
        ...options,
    });
};

export const useResetPasswordMutation = (
    options?: UseMutationOptions<void, Error, ResetPasswordPayload>
): UseMutationResult<void, Error, ResetPasswordPayload> => {
    return useMutation({
        mutationFn: authApi.resetPassword,
        ...options,
    });
};

export const useSetNewPasswordMutation = (
    options?: UseMutationOptions<void, Error, NewPasswordPayload>
): UseMutationResult<void, Error, NewPasswordPayload> => {
    return useMutation({
        mutationFn: authApi.setNewPassword,
        ...options,
    });
};
