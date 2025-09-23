import { SubmitFunction, useSubmit } from "react-router-dom";
import { SignInFormValues } from "@app/features/auth/signIn/SignInForm";
import { SignUpFormValues } from "@app/features/auth/signUp/SignUpForm";
import { SIGN_OUT_ACTION_ONLY_PATH } from "@app/core/constants/pathConstants.ts";
import { Profile, TwoFactorSignInPayload, useGetProfileQuery } from "@app/core/services";
import { SIGN_IN_ACTION_KEY, SIGN_IN_WITH_CREDENTIALS, SIGN_IN_WITH_TWO_FACTOR } from "@app/features";

interface UseAuth {
    profile: Profile;
    isLoading: boolean;
    isFetching: boolean;
    signOut: () => void;
    signIn: (data: SignInFormValues) => void;
    signUp: (data: SignUpFormValues) => void;
    signInWithTwoFactor: (data: TwoFactorSignInPayload) => void;
}

export const useAuth = (): UseAuth => {
    const submit: SubmitFunction = useSubmit();
    const { data, isLoading, isFetching } = useGetProfileQuery();

    const signOut = (): void => submit(null, { method: "post", action: SIGN_OUT_ACTION_ONLY_PATH });

    const signIn = (data: SignInFormValues) =>
        submit({ ...data, [SIGN_IN_ACTION_KEY]: SIGN_IN_WITH_CREDENTIALS }, { method: "post" });

    const signInWithTwoFactor = (data: TwoFactorSignInPayload) =>
        submit({ ...data, [SIGN_IN_ACTION_KEY]: SIGN_IN_WITH_TWO_FACTOR }, { method: "post" });

    const signUp = (data: SignUpFormValues) => submit({ ...data }, { method: "post" });

    return {
        signOut,
        signUp,
        signIn,
        isLoading,
        isFetching,
        signInWithTwoFactor,
        // Profile is preoloaded after sign-in, check loader in AppLayout
        profile: data as Profile,
    };
};
