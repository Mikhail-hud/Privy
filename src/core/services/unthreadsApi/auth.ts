import { SESSIONS_TAG, unthreadsApi } from "@app/core/services";

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

export interface User {
    id: number;
    username: string;
    role: UserRole;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    password: string;
    passwordRepeat: string;
}

export const authApi = unthreadsApi.injectEndpoints({
    endpoints: builder => ({
        getSessions: builder.query<Session[], void>({
            query: (): string => "auth/sessions",
            providesTags: () => [SESSIONS_TAG],
        }),
        revokeSession: builder.mutation<unknown, number>({
            query: (id: number) => ({
                url: `/auth/sessions/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_, err) => (err ? [] : [SESSIONS_TAG]),
        }),
        revokeAllSessions: builder.mutation<unknown, void>({
            query: () => ({
                url: `/auth/sessions/revoke-all`,
                method: "POST",
            }),
            invalidatesTags: (_, err) => (err ? [] : [SESSIONS_TAG]),
        }),
        changePassword: builder.mutation<unknown, ChangePasswordPayload>({
            query: body => ({
                url: `/auth/sessions/change-password`,
                method: "POST",
                body,
            }),
            invalidatesTags: (_, err) => (err ? [] : [SESSIONS_TAG]),
        }),
    }),
    overrideExisting: false,
});

export const { useGetSessionsQuery, useRevokeSessionMutation, useRevokeAllSessionsMutation } = authApi;
