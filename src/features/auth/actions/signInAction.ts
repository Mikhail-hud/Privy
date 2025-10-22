/**
 * @file src/features/auth/actions/signInAction.ts
 * React Router action handling user sign-in (credentials and optional two-factor).
 * Determines intent from form data, dispatches the appropriate RTK Query mutation,
 * returns a redirect on success, or structured error data for UI consumption on failure.
 */

import { store } from "@app/core/store";
import { redirect } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { QueryError } from "@app/core/interfaces";
import { GENERIC_ERROR_MESSAGE } from "@app/core/constants/general";
import { PROFILE_PAGE_PATH } from "@app/core/constants/pathConstants";
import { authApi, SignInPayload, TwoFactorSignInPayload, TwoFactorStatus, Profile } from "@app/core/services";

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
 * React Router action handling both credential and two-factor sign-in flows.
 *
 * Flow:
 * 1. Reads FormData and extracts the intent (`intent` field).
 * 2. If credentials flow:
 *    - Dispatches signIn mutation.
 *    - If response indicates twoFactorRequired, returns that status object (handled by UI).
 *    - Otherwise redirects to profile on success.
 *    - On failure, surfaces snackbar + returns { credentialsError }.
 * 3. If two-factor flow:
 *    - Dispatches twoFactorSignIn mutation.
 *    - Redirects to profile on success.
 *    - On failure, surfaces snackbar + return { twoFactorError }.
 * 4. If intent is unknown, returns { error }.
 *
 * Errors are normalized into structured objects; no exceptions escape.
 *
 * @param requestWrapper Wrapper containing the incoming Request from React Router.
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
 * },
 */
export const signInAction = async ({ request }: { request: Request }): Promise<Response | AuthActionData> => {
    const formData: FormData = await request.formData();

    const intent = formData.get(SIGN_IN_ACTION_KEY);

    if (intent === SIGN_IN_WITH_CREDENTIALS) {
        const credentials = Object.fromEntries(formData) as unknown as SignInFormDataPayload;
        // TODO: validate credentials here or in the form before dispatching
        const { identifier, password, rememberMe } = credentials;
        const promise = store.dispatch(authApi.endpoints.signIn.initiate({ identifier, password, rememberMe }));
        try {
            const userAuthStatus: TwoFactorStatus | Profile = await promise.unwrap();
            if ("twoFactorRequired" in userAuthStatus) {
                return userAuthStatus;
            }
            return redirect(PROFILE_PAGE_PATH);
        } catch (error) {
            const errorMessage = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
            enqueueSnackbar(errorMessage, { variant: "error" });
            return { credentialsError: errorMessage };
        }
    }
    if (intent === SIGN_IN_WITH_TWO_FACTOR) {
        const twoFactorPayload = Object.fromEntries(formData) as unknown as TwoFactorSignInFormDataPayload;
        const { twoFactorCode } = twoFactorPayload;
        const promise = store.dispatch(authApi.endpoints.twoFactorSignIn.initiate({ twoFactorCode }));
        try {
            await promise.unwrap();
            return redirect(PROFILE_PAGE_PATH);
        } catch (error) {
            const errorMessage = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
            enqueueSnackbar(errorMessage, { variant: "error" });
            return { twoFactorError: errorMessage };
        }
    }
    return { error: "Invalid Sign In Action Type" };
};
