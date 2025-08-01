import { store } from "@app/core/store";
import { redirect } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { GENERIC_ERROR_MESSAGE } from "@app/core/constants/general";
import { PROFILE_PAGE_PATH } from "@app/core/constants/pathConstants";
import { authApi, SignInPayload, TwoFactorSignInPayload, UserWithTwoFactor } from "@app/core/services";

export const SIGN_IN_ACTION_KEY = "intent";
export const SIGN_IN_WITH_TWO_FACTOR = "signInWithTwoFactor";
export const SIGN_IN_WITH_CREDENTIALS = "signInWithCredentials";

export interface AuthActionData {
    credentialsError?: string;
    twoFactorError?: string;
    error?: string;
    user?: UserWithTwoFactor;
}

export interface SignInFormDataPayload extends SignInPayload {
    [SIGN_IN_ACTION_KEY]: typeof SIGN_IN_WITH_CREDENTIALS;
}

export interface TwoFactorSignInFormDataPayload extends TwoFactorSignInPayload {
    [SIGN_IN_ACTION_KEY]: typeof SIGN_IN_WITH_TWO_FACTOR;
}

export const signInAction = async ({ request }: { request: Request }): Promise<Response | AuthActionData> => {
    const formData: FormData = await request.formData();

    const intent = formData.get(SIGN_IN_ACTION_KEY);

    if (intent === SIGN_IN_WITH_CREDENTIALS) {
        const credentials = Object.fromEntries(formData) as unknown as SignInFormDataPayload;
        const { identifier, password, rememberMe } = credentials;
        const promise = store.dispatch(authApi.endpoints.signIn.initiate({ identifier, password, rememberMe }));
        try {
            const user: UserWithTwoFactor = await promise.unwrap();
            if (user.twoFactorRequired) {
                return { user };
            }
            return redirect(PROFILE_PAGE_PATH);
        } catch (error) {
            const errorMessage = error?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
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
            const errorMessage = error?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
            enqueueSnackbar(errorMessage, { variant: "error" });
            return { twoFactorError: errorMessage };
        }
    }
    return { error: "Invalid Sign In Action Type" };
};
