/**
 * @file src/features/auth/actions/signOutAction.ts
 * Action that signs the current user out. Dispatches the RTK Query `signOut` mutation,
 * redirects to the sign-in page on success, or shows an error snackbar and returns `null` on failure.
 */

import { store } from "@app/core/store";
import { redirect } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { authApi } from "@app/core/services";
import { QueryError } from "@app/core/interfaces";
import { GENERIC_ERROR_MESSAGE } from "@app/core/constants/general";
import { SIGN_IN_PAGE_PATH } from "@app/core/constants/pathConstants";

/**
 * Executes the sign-out mutation and returns a redirect to the sign-in page on success.
 * On failure, surfaces an error notification and returns `null`.
 *
 * Flow:
 * 1. Dispatch `authApi.endpoints.signOut.initiate()`.
 * 2. Await `unwrap()` to throw on error.
 * 3. Redirect to sign in on success.
 * 4. On error: extract a message (or fallback), enqueue snackbar, return `null`.
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
    const promise = store.dispatch(authApi.endpoints.signOut.initiate());
    try {
        await promise.unwrap();
        return redirect(SIGN_IN_PAGE_PATH);
    } catch (error) {
        const errorMessage = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
        enqueueSnackbar(errorMessage, { variant: "error" });
        return null;
    }
};
