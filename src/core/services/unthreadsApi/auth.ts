import { SESSIONS_TAG, TAG_TYPES, unthreadsApi, USER_TAG } from "@app/core/services";

export interface SignInPayload {
    identifier: string;
    password: string;
    rememberMe?: boolean;
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

export interface ResetPasswordPayload {
    email: string;
}

export interface newPasswordPayload {
    token: string;
    password: string;
    passwordRepeat: string;
}

export const authApi = unthreadsApi.injectEndpoints({
    endpoints: builder => ({
        me: builder.query<User, void>({
            query: () => "auth/me",
            providesTags: () => [USER_TAG],
        }),
        signIn: builder.mutation<User, SignInPayload>({
            query: body => ({
                url: "auth/sign-in",
                method: "POST",
                body,
            }),
            invalidatesTags: (_, err) => (err ? [] : TAG_TYPES),
            async onQueryStarted(_a: never, { dispatch, queryFulfilled }): Promise<void> {
                const { data } = await queryFulfilled;
                // Update the 'me' query data with the signed-in user
                dispatch(authApi.util.upsertQueryData("me", undefined, data));
            },
        }),
        signOut: builder.mutation<unknown, void>({
            query: () => ({
                url: `auth/sign-out`,
                method: "POST",
            }),
            invalidatesTags: (_, err) => (err ? [] : [USER_TAG]),
        }),
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
            // Change password revokes all sessions except the current one
            invalidatesTags: (_, err) => (err ? [] : [SESSIONS_TAG]),
        }),

        resetPassword: builder.mutation<unknown, ResetPasswordPayload>({
            query: body => ({
                url: `/auth/password-recovery/reset`,
                method: "POST",
                body,
            }),
            invalidatesTags: (_, err) => (err ? [] : [USER_TAG]),
        }),
        setNewPassword: builder.mutation<unknown, newPasswordPayload>({
            query: body => ({
                url: `/auth/password-recovery/new-password`,
                method: "POST",
                body,
            }),
            invalidatesTags: (_, err) => (err ? [] : [USER_TAG]),
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetSessionsQuery,
    useRevokeSessionMutation,
    useRevokeAllSessionsMutation,
    useResetPasswordMutation,
    useSetNewPasswordMutation,
} = authApi;
