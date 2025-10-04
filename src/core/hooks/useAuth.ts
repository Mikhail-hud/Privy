/**
 * @file React hook centralizing authentication helpers: loading the current user profile (unless on a public route),
 * and exposing imperative actions for sign in (credentials + 2FA), sign up, and sign out.
 */

import { SubmitFunction, useSubmit } from "react-router-dom";
import { SignInFormValues } from "@app/features/auth/signIn/SignInForm";
import { SignUpFormValues } from "@app/features/auth/signUp/SignUpForm";
import { User, TwoFactorSignInPayload, useGetProfileQuery } from "@app/core/services";
import { PUBLIC_ROUTES, SIGN_OUT_ACTION_ONLY_PATH } from "@app/core/constants/pathConstants";
import { SIGN_IN_ACTION_KEY, SIGN_IN_WITH_CREDENTIALS, SIGN_IN_WITH_TWO_FACTOR } from "@app/features";

/**
 * Shape returned by the `useAuth` hook.
 * profile: The authenticated user (undefined until loaded on protected routes).
 * isLoading: Initial load state for the profile query (skipped on public routes).
 * isFetching: Any in-flight refetch status.
 * signOut: Triggers server sign-out through a POST action.
 * signIn: Submits credentials (identifier, password, rememberMe) for authentication.
 * signUp: Submits registration data.
 * signInWithTwoFactor: Submits second factor verification payload.
 */
interface UseAuth {
    profile: User;
    isLoading: boolean;
    isFetching: boolean;
    signOut: () => void;
    signIn: (data: SignInFormValues) => void;
    signUp: (data: SignUpFormValues) => void;
    signInWithTwoFactor: (data: TwoFactorSignInPayload) => void;
}

/**
 * Provides auth-related helper actions and (optionally) the current user profile.
 * The profile query is skipped when the current pathname matches a public route.
 *
 * TypeScript fix: Replaced `PUBLIC_ROUTES.includes(location.pathname)` (caused TS2345 due to
 * literal route union vs generic string) with `.some(route => route === location.pathname)` to
 * avoid passing a plain string as the search argument to a literal-typed array.
 *
 * @returns UseAuth helper object.
 *
 * @example
 * const { profile, signIn, signOut, isLoading } = useAuth();
 */
export const useAuth = (): UseAuth => {
    const submit: SubmitFunction = useSubmit();

    // Safe literal route union comparison without widening array element types
    const isPublicPage: boolean = PUBLIC_ROUTES.some(route => route === location.pathname);

    const { data, isLoading, isFetching } = useGetProfileQuery(undefined, { skip: isPublicPage });

    /** Dispatches a sign-out action POST to invalidate the session server-side. */
    const signOut = (): void => submit(null, { method: "post", action: SIGN_OUT_ACTION_ONLY_PATH });

    /** Initiates credentials-based sign-in (first step; may require 2FA). */
    const signIn = (data: SignInFormValues): void =>
        submit({ ...data, [SIGN_IN_ACTION_KEY]: SIGN_IN_WITH_CREDENTIALS }, { method: "post" });

    /** Completes second factor sign-in when required. */
    const signInWithTwoFactor = (data: TwoFactorSignInPayload): void =>
        submit({ ...data, [SIGN_IN_ACTION_KEY]: SIGN_IN_WITH_TWO_FACTOR }, { method: "post" });

    /** Submits registration data to the sign-up action. */
    const signUp = (data: SignUpFormValues): void => submit({ ...data }, { method: "post" });

    return {
        signOut,
        signUp,
        signIn,
        isLoading,
        isFetching,
        signInWithTwoFactor,
        // Profile is preloaded after sign-in; see protected layout loader.
        profile: data as User,
    };
};
