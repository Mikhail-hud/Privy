/**
 * @file src/features/auth/actions/signOutAction.ts
 * React Router action to sign out the current user. Dispatches the RTK Query `signOut` mutation,
 * redirects to the sign-in page on success, or shows an error notification and returns `null` on failure.
 */

import { redirect } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { ApiError, authApi } from "@app/core/services";
import { SIGN_IN_PAGE_PATH } from "@app/core/constants/pathConstants";

/**
 * Executes the sign-out mutation and returns a redirect to the sign-in page on success.
 * On failure, surfaces an error notification and returns `null`.
 *
 * Flow:
 * 1. Calls `authApi.signOut()` to perform the sign-out mutation.
 * 2. On success, redirects to the sign-in page.
 * 3. On error, extracts the error message, shows a snackbar, and returns `null`.
 *
 * Errors are handled internally; no exception escapes.
 *
 * @returns {Promise<Response | null>} Redirect `Response` on success, `null` on failure.
 *
 *  @example
 * // In a route definition: src/core/app/App.tsx
 * {
 *   // Action only route, no element
 *   path: SIGN_OUT_ACTION_ONLY_PATH,
 *   action: signOutAction,
 *   loader: () => redirect(PROFILE_PAGE_PATH),
 *  },
 */
export const signOutAction = async (): Promise<Response | null> => {
    try {
        await authApi.signOut();
        return redirect(SIGN_IN_PAGE_PATH);
    } catch (error) {
        const errorMessage: string = (error as ApiError)?.message;
        enqueueSnackbar(errorMessage, { variant: "error" });
        return null;
    }
};
