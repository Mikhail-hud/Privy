import { store } from "@app/core/store";
import { redirect } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
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

export const signInAction = async ({ request }: { request: Request }): Promise<Response | AuthActionData> => {
    const formData: FormData = await request.formData();

    const intent = formData.get(SIGN_IN_ACTION_KEY);

    if (intent === SIGN_IN_WITH_CREDENTIALS) {
        const credentials: SignInPayload = Object.fromEntries(formData) as unknown as SignInPayload;
        const { identifier, password, rememberMe } = credentials;
        const promise = store.dispatch(authApi.endpoints.signIn.initiate({ identifier, password, rememberMe }));
        try {
            const user: UserWithTwoFactor = await promise.unwrap();
            if (user.twoFactorRequired) {
                return { user };
            }
            return redirect(PROFILE_PAGE_PATH);
        } catch (error) {
            const errorMessage = error?.data?.message?.toString() || "Something went wrong. Please try again later.";
            enqueueSnackbar(errorMessage, { variant: "error" });
            return { credentialsError: errorMessage };
        }
    }
    if (intent === SIGN_IN_WITH_TWO_FACTOR) {
        const twoFactorPayload: TwoFactorSignInPayload = Object.fromEntries(
            formData
        ) as unknown as TwoFactorSignInPayload;
        const { twoFactorCode } = twoFactorPayload;
        const promise = store.dispatch(authApi.endpoints.twoFactorSignIn.initiate({ twoFactorCode }));
        try {
            await promise.unwrap();
            return redirect(PROFILE_PAGE_PATH);
        } catch (error) {
            const errorMessage = error?.data?.message?.toString() || "Something went wrong. Please try again later.";
            enqueueSnackbar(errorMessage, { variant: "error" });
            return { twoFactorError: errorMessage };
        }
    }
    return { error: "Invalid Sign In Action Type" };
};
