import { FC } from "react";
import { Box, Button } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { SubmitHandler, useForm } from "react-hook-form";
import { VALIDATE_RELES } from "@app/core/constants/rulesConstants";
import { Password } from "@app/features/auth/components/FormControls";
import { NavigateFunction, useSearchParams } from "react-router-dom";
import { newPasswordPayload, useSetNewPasswordMutation } from "@app/core/services";
import { SIGN_IN_PAGE_PATH, TOKEN_PARAM_KEY } from "@app/core/constants/pathConstants";

export const RESET_PASSWORD_FORM_FIELDS = {
    password: { name: "password", label: "New Password" },
    passwordRepeat: { name: "passwordRepeat", label: "Repeat New Password" },
} as const;

export interface ResetPasswordFormValues {
    [RESET_PASSWORD_FORM_FIELDS.password.name]: string;
    [RESET_PASSWORD_FORM_FIELDS.passwordRepeat.name]: string;
}

export const ResetPasswordForm: FC = () => {
    const navigate: NavigateFunction = useNavigate();
    const [searchParams] = useSearchParams();
    const [setNewPassword, { isLoading }] = useSetNewPasswordMutation();
    const form = useForm<ResetPasswordFormValues>({
        mode: "onTouched",
    });
    const { handleSubmit, getValues, control } = form;

    const onValidSubmit: SubmitHandler<ResetPasswordFormValues> = async ({
        password,
        passwordRepeat,
    }: newPasswordPayload): Promise<void> => {
        const token: string | null = searchParams.get(TOKEN_PARAM_KEY);

        if (!token) {
            enqueueSnackbar("Invalid or missing token.", { variant: "error" });
            return;
        }
        try {
            await setNewPassword({ token, password, passwordRepeat }).unwrap();
            enqueueSnackbar("Password has been reset successfully.", { variant: "success" });
            navigate(SIGN_IN_PAGE_PATH, { replace: true });
        } catch (error) {
            enqueueSnackbar(error.data.message?.toString(), { variant: "error" });
        }
    };
    return (
        <Box
            noValidate
            method="post"
            component="form"
            onSubmit={handleSubmit(onValidSubmit)}
            sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}
        >
            <Password<ResetPasswordFormValues>
                autoFocus
                control={control}
                autoComplete="new-password"
                placeholder="Enter your new password"
                label={RESET_PASSWORD_FORM_FIELDS.password.label}
                name={RESET_PASSWORD_FORM_FIELDS.password.name}
                rules={VALIDATE_RELES.PASSWORD}
            />
            <Password<ResetPasswordFormValues>
                control={control}
                autoComplete="new-password"
                placeholder="Repeat your new password"
                label={RESET_PASSWORD_FORM_FIELDS.passwordRepeat.label}
                name={RESET_PASSWORD_FORM_FIELDS.passwordRepeat.name}
                rules={{
                    ...VALIDATE_RELES.PASSWORD_REPEAT,
                    validate: value => {
                        if (value !== getValues(RESET_PASSWORD_FORM_FIELDS.password.name)) {
                            return "Passwords do not match";
                        }
                        return true;
                    },
                }}
            />
            <Button type="submit" fullWidth variant="contained" loadingPosition="start" loading={isLoading}>
                Reset Password
            </Button>
        </Box>
    );
};
