/**
 * Authentication and user session management API using RTK Query.
 *
 * Defines types, cache sync logic, and endpoints for authentication actions.
 *
 * Types:
 * - `User`, `Session`, `SignInPayload`, `SignUpPayload`, `TwoFactorSignInPayload`, etc.
 *   Represent user, session, and authentication payloads.
 *
 * Helper:
 * - `syncUserInCache(userData)`: Updates user data in both `authApi` and `profileApi` caches.
 *
 * Endpoints:
 * - `me`: Fetches current user profile.
 * - `signIn`: Authenticates user (supports two-factor).
 * - `signUp`: Registers a new user.
 * - `twoFactorSignIn`: Signs in with two-factor authentication.
 * - `signOut`: Logs out the user.
 * - `checkUserNameAvailability`: Checks username availability.
 * - `getSessions`: Lists user sessions.
 * - `revokeSession`: Revokes a specific session.
 * - `revokeAllSessions`: Revokes all sessions except current.
 * - `changePassword`: Changes user password.
 * - `resetPassword`: Initiates password reset.
 * - `setNewPassword`: Sets a new password after reset.
 *
 * Exports React hooks for each endpoint for use in components.
 */

import { AppDispatch } from "@app/core/store";
import {
    SESSIONS_TAG,
    TAG_TYPES,
    privyApi,
    USER_NAME_TAG,
    USER_TAG,
    profileApi,
    Tag,
    Photo,
    UserLink,
} from "@app/core/services";

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

export interface User {
    id: number;
    userName: string;
    role: UserRole;
    email: string;
    interests: Tag[];
    fullName: string;
    biography: string;
    birthDate: string;
    gender: UserGender;
    createdAt: string;
    updatedAt: string;
    isProfileIncognito: boolean;
    publicPhoto: Photo | null;
    privatePhoto: Photo | null;
    links: UserLink[];
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

export interface newPasswordPayload {
    token: string;
    password: string;
    passwordRepeat: string;
}

const syncUserInCache =
    (userData: User) =>
    (dispatch: AppDispatch): void => {
        dispatch(authApi.util.upsertQueryData("me", undefined, userData));
        dispatch(profileApi.util.upsertQueryData("getProfile", undefined, userData));
    };

export const authApi = privyApi.injectEndpoints({
    endpoints: builder => ({
        me: builder.query<User, void>({
            query: () => "auth/me",
            providesTags: () => [USER_TAG],
            async onQueryStarted(_a: never, { dispatch, queryFulfilled }): Promise<void> {
                const { data } = await queryFulfilled;
                dispatch(profileApi.util.upsertQueryData("getProfile", undefined, data));
            },
        }),
        signIn: builder.mutation<TwoFactorStatus | User, SignInPayload>({
            query: body => ({
                url: "auth/sign-in",
                method: "POST",
                body,
            }),
            invalidatesTags: (_, err) => (err ? [] : TAG_TYPES),
            async onQueryStarted(_a: never, { dispatch, queryFulfilled }): Promise<void> {
                const { data } = await queryFulfilled;
                // if two-factor is required, do not sync user in cache
                if ("twoFactorRequired" in data) return;
                dispatch(syncUserInCache(data));
            },
        }),
        signUp: builder.mutation<User, SignUpPayload>({
            query: body => ({
                url: "auth/sign-up",
                method: "POST",
                body,
            }),
            invalidatesTags: (_, err) => (err ? [] : TAG_TYPES),
            async onQueryStarted(_a: never, { dispatch, queryFulfilled }): Promise<void> {
                const { data } = await queryFulfilled;
                dispatch(syncUserInCache(data));
            },
        }),
        twoFactorSignIn: builder.mutation<User, TwoFactorSignInPayload>({
            query: body => ({
                url: "auth/sign-in/two-factor",
                method: "POST",
                body,
            }),
            invalidatesTags: (_, err) => (err ? [] : TAG_TYPES),
            async onQueryStarted(_a: never, { dispatch, queryFulfilled }): Promise<void> {
                const { data } = await queryFulfilled;
                dispatch(syncUserInCache(data));
            },
        }),
        signOut: builder.mutation<unknown, void>({
            query: () => ({
                url: `auth/sign-out`,
                method: "POST",
            }),
            invalidatesTags: (_, err) => (err ? [] : [USER_TAG]),
        }),
        checkUserNameAvailability: builder.query<UserNameAvailabilityResponse, UserNameAvailabilityPayload>({
            query: payload => ({
                url: `auth/user-name/availability`,
                method: "GET",
                params: payload,
            }),
            providesTags: () => [USER_NAME_TAG],
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
    useMeQuery,
    useLazyCheckUserNameAvailabilityQuery,
    useRevokeSessionMutation,
    useRevokeAllSessionsMutation,
    useResetPasswordMutation,
    useSetNewPasswordMutation,
} = authApi;
