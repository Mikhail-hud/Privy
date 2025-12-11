/**
 * @file src/features/auth/actions/signUpAction.ts
 * React Router action handler for user sign-up. Processes form data, dispatches the sign-up RTK Query mutation,
 * redirects to the profile page on success, or returns a structured error object and displays a snackbar on failure.
 */

import { redirect } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { ApiError, authApi, SignUpPayload } from "@app/core/services";
import { PROFILE_PAGE_PATH } from "@app/core/constants/pathConstants";

/**
 * Shape returned when the sign-up attempt fails validation or request processing.
 * error: Human-readable message suitable for display.
 * errors: Optional field-level validation errors keyed by the field name.
 */
interface ActionError {
    error: string;
    errors?: Record<string, string>;
}

/**
 * Handles a sign-up form submission in a React Router data route action.
 *
 * Flow:
 * 1. Extracts form data from the incoming Request.
 * 2. Converts FormData entries into a plain credentials object.
 * 3. Dispatches the RTK Query `signUp` mutation.
 * 4. On success: redirects to the profile page.
 * 5. On failure: extracts a message (or uses a generic fallback), enqueues an error snackbar, and returns a structured error object.
 *
 * No exceptions are propagated; failures are normalized into an ActionError return value.
 *
 * @param requestWrapper Object containing the Fetch API Request supplied by React Router.
 * @returns Promise resolving to a redirect Response on success or an ActionError on failure.
 *
 * * @example
 *  * // In a route definition: src/core/app/App.tsx
 *  * {
 *  *   path: SIGN_UP_PAGE_PATH,
 *  *   action: signUpAction,
 *  *   element: <SignUp />,
 *  *   loader: publicRoutesLoader,
 *  * },
 *  */
export const signUpAction = async ({ request }: { request: Request }): Promise<Response | ActionError> => {
    const formData: FormData = await request.formData();
    const credentials = Object.fromEntries(formData);
    // TODO: validate credentials here or in the form before dispatching
    try {
        await authApi.signUp(credentials as unknown as SignUpPayload);
        return redirect(PROFILE_PAGE_PATH);
    } catch (error) {
        const errorMessage: string = (error as ApiError)?.message;
        enqueueSnackbar(errorMessage, { variant: "error" });
        return {
            error: errorMessage,
            errors: (error as ApiError)?.errors,
        };
    }
};
