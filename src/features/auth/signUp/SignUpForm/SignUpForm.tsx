import { FC } from "react";
import { enqueueSnackbar } from "notistack";
import { Box, Button } from "@mui/material";
import { VALIDATE_RELES } from "@app/core/constants/rulesConstants";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Password, RememberMe } from "@app/features/auth/components/FormControls";
import { Navigation, SubmitFunction, useActionData, useNavigation, useSubmit } from "react-router-dom";

export const SIGN_UP_FORM_FIELDS = {
    password: { name: "password", label: "Password" },
    rememberMe: { name: "rememberMe", label: "Remember me" },
    passwordRepeat: { name: "passwordRepeat", label: "Repeat Password" },
};

export interface SignUpFormValues {
    [SIGN_UP_FORM_FIELDS.password.name]: string;
    [SIGN_UP_FORM_FIELDS.rememberMe.name]: boolean;
}

export const SignUpForm: FC = () => {
    const submit: SubmitFunction = useSubmit();
    const navigation: Navigation = useNavigation();
    const actionData = useActionData() as { error: string } | undefined;

    const form = useForm<SignUpFormValues>();
    const { handleSubmit, setError, getValues, control } = form;

    const isSubmitting: boolean = navigation.state === "submitting";

    const onValidSubmit: SubmitHandler<SignUpFormValues> = data => {
        submit({ ...data }, { method: "post" });
    };

    useEffect((): void => {
        if (actionData?.error) {
            setError(SIGN_UP_FORM_FIELDS.password.name, { message: actionData?.error });
            enqueueSnackbar(actionData.error, { variant: "error" });
        }
    }, [actionData]);

    return (
        <FormProvider {...form}>
            <Box
                noValidate
                method="post"
                component="form"
                onSubmit={handleSubmit(onValidSubmit)}
                sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}
            >
                <Password<SignUpFormValues>
                    control={control}
                    name={SIGN_UP_FORM_FIELDS.password.name}
                    label={SIGN_UP_FORM_FIELDS.password.label}
                    autoComplete="current-password"
                    rules={{
                        required: "Password is required",
                        minLength: VALIDATE_RELES.PASSWORD.minLength,
                        maxLength: VALIDATE_RELES.PASSWORD.maxLength,
                    }}
                />
                <Password<SignUpFormValues>
                    control={control}
                    autoComplete="new-password"
                    label={SIGN_UP_FORM_FIELDS.passwordRepeat.label}
                    name={SIGN_UP_FORM_FIELDS.passwordRepeat.name}
                    rules={{
                        required: "Repeat Password is required",
                        validate: value => {
                            if (value !== getValues(SIGN_UP_FORM_FIELDS.password.name)) {
                                return "Passwords do not match";
                            }
                            return true;
                        },
                    }}
                />
                <RememberMe label={SIGN_UP_FORM_FIELDS.rememberMe.label} name={SIGN_UP_FORM_FIELDS.rememberMe.name} />
                <Button type="submit" fullWidth variant="contained" loadingPosition="start" loading={isSubmitting}>
                    Sign Up
                </Button>
            </Box>
        </FormProvider>
    );
};
