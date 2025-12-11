/**
 * @file src/features/auth/actions/signInAction.ts
 * Handles user sign-in via React Router action, supporting both credentials and two-factor authentication flows.
 * Determines the sign-in intent from form data, dispatches the appropriate RTK Query mutation,
 * and returns either a redirect on success or structured error data for UI handling on failure.
 */

import { redirect } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { PROFILE_PAGE_PATH } from "@app/core/constants/pathConstants";
import { authApi, SignInPayload, TwoFactorSignInPayload, TwoFactorStatus, Profile, ApiError } from "@app/core/services";

/** Name of the form field indicating which sign-in action is intended. */
export const SIGN_IN_ACTION_KEY = "intent";
/** Form intent value for the second factor submission. */
export const SIGN_IN_WITH_TWO_FACTOR = "signInWithTwoFactor";
/** Form intent value for initial credentials submission. */
export const SIGN_IN_WITH_CREDENTIALS = "signInWithCredentials";

/**
 * Shape of action data returned to the UI when an error or intermediate (2FA) state occurs.
 * credentialsError: Error from an initial credential attempt.
 * twoFactorError: Error from the second factor submission.
 * error: Generic invalid intent or unexpected condition.
 * twoFactorRequired: Flag indicating a second factor step is needed.
 */
export interface AuthActionData {
    credentialsError?: string;
    twoFactorError?: string;
    error?: string;
    twoFactorRequired?: boolean;
}

/** FormData payload for the credential submission branch (includes intent discriminator). */
export interface SignInFormDataPayload extends SignInPayload {
    [SIGN_IN_ACTION_KEY]: typeof SIGN_IN_WITH_CREDENTIALS;
}

/** FormData payload for the two-factor submission branch (includes intent discriminator). */
export interface TwoFactorSignInFormDataPayload extends TwoFactorSignInPayload {
    [SIGN_IN_ACTION_KEY]: typeof SIGN_IN_WITH_TWO_FACTOR;
}

/**
 * React Router action for user sign-in, supporting credentials and two-factor authentication.
 *
 * Flow:
 * 1. Reads FormData and extracts the intent (`intent` field).
 * 2. If credentials flow:
 *    - Dispatches signIn mutation.
 *    - If response indicates twoFactorRequired, returns that status object for UI handling.
 *    - Otherwise, redirects to the profile page on success.
 *    - On failure, shows a snackbar and returns `{ credentialsError }`.
 * 3. If two-factor flow:
 *    - Dispatches twoFactorSignIn mutation.
 *    - Redirects to the profile page on success.
 *    - On failure, shows a snackbar and returns `{ twoFactorError }`.
 * 4. If intent is unknown, returns `{ error }`.
 *
 * All errors are normalized into structured objects; no exceptions are thrown outward.
 *
 * @param request Incoming Request object from React Router.
 * @returns Promise resolving to:
 * - Response (redirect) on successful authentication.
 * - AuthActionData with errors or twoFactorRequired state.
 *
 * @example
 * // In a route definition: src/core/app/App.tsx
 * {
 *   path: SIGN_IN_PAGE_PATH,
 *   action: signInAction,
 *   element: <SignIn />,
 *   loader: publicRoutesLoader,
 * }
 */
export const signInAction = async ({ request }: { request: Request }): Promise<Response | AuthActionData> => {
    const formData: FormData = await request.formData();

    const intent = formData.get(SIGN_IN_ACTION_KEY);

    if (intent === SIGN_IN_WITH_CREDENTIALS) {
        const credentials = Object.fromEntries(formData) as unknown as SignInFormDataPayload;
        // TODO: validate credentials here or in the form before dispatching
        const { identifier, password, rememberMe } = credentials;
        try {
            const userAuthStatus: TwoFactorStatus | Profile = await authApi.signIn({
                identifier,
                password,
                rememberMe,
            });
            if ("twoFactorRequired" in userAuthStatus) {
                return userAuthStatus;
            }
            return redirect(PROFILE_PAGE_PATH);
        } catch (error) {
            const errorMessage: string = (error as ApiError)?.message;
            enqueueSnackbar(errorMessage, { variant: "error" });
            return { credentialsError: errorMessage };
        }
    }
    if (intent === SIGN_IN_WITH_TWO_FACTOR) {
        const twoFactorPayload = Object.fromEntries(formData) as unknown as TwoFactorSignInFormDataPayload;
        const { twoFactorCode } = twoFactorPayload;
        try {
            await authApi.twoFactorSignIn({ twoFactorCode });
            return redirect(PROFILE_PAGE_PATH);
        } catch (error) {
            const errorMessage: string = (error as ApiError)?.message;
            enqueueSnackbar(errorMessage, { variant: "error" });
            return { twoFactorError: errorMessage };
        }
    }
    return { error: "Invalid Sign In Action Type" };
};
