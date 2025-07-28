import { Box, Link, Button } from "@mui/material";
import { FC, useState, MouseEvent, useEffect } from "react";
import { VALIDATE_RELES } from "@app/core/constants/rulesConstants";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Password, RememberMe } from "@app/features/auth/components/FormControls";
import { AuthActionData, SIGN_IN_ACTION_KEY, SIGN_IN_WITH_CREDENTIALS } from "@app/features";
import { Navigation, SubmitFunction, useActionData, useNavigation, useSubmit } from "react-router-dom";
import { Identifier, ForgotPassword, TwoFactor } from "@app/features/auth/signIn/SignInForm/FormControls";

export const SIGN_IN_FORM_FIELDS = {
    identifier: {
        name: "identifier",
        label: "Identifier (Email or Username)",
    },
    password: { name: "password", label: "Password" },
    rememberMe: { name: "rememberMe", label: "Remember me" },
};

export interface SignInFormValues {
    [SIGN_IN_FORM_FIELDS.identifier.name]: string;
    [SIGN_IN_FORM_FIELDS.password.name]: string;
    [SIGN_IN_FORM_FIELDS.rememberMe.name]: boolean;
}

export const SignInForm: FC = () => {
    const submit: SubmitFunction = useSubmit();
    const navigation: Navigation = useNavigation();
    const actionData = useActionData() as AuthActionData;

    const form = useForm<SignInFormValues>();
    const { handleSubmit, setError, control } = form;
    const [open, setOpen] = useState<boolean>(false);

    const handleClickOpen = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const isSubmitting: boolean = navigation.state === "submitting";

    const onValidSubmit: SubmitHandler<SignInFormValues> = data => {
        submit({ ...data, [SIGN_IN_ACTION_KEY]: SIGN_IN_WITH_CREDENTIALS }, { method: "post" });
    };
    useEffect((): void => {
        if (actionData?.credentialsError) {
            setError(SIGN_IN_FORM_FIELDS.identifier.name, { message: actionData?.credentialsError });
            setError(SIGN_IN_FORM_FIELDS.password.name, { message: actionData?.credentialsError });
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
                <Identifier />
                <Password<SignInFormValues>
                    control={control}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    rules={VALIDATE_RELES.PASSWORD}
                    name={SIGN_IN_FORM_FIELDS.password.name}
                    label={SIGN_IN_FORM_FIELDS.password.label}
                />
                <RememberMe
                    label={SIGN_IN_FORM_FIELDS.rememberMe.label}
                    name={SIGN_IN_FORM_FIELDS.rememberMe.name}
                    control={control}
                />
                <ForgotPassword open={open} handleClose={handleClose} />
                <TwoFactor />
                <Button type="submit" fullWidth variant="contained" loadingPosition="start" loading={isSubmitting}>
                    Sign in
                </Button>
                <Link variant="body2" component="button" onClick={handleClickOpen}>
                    Forgot your password?
                </Link>
            </Box>
        </FormProvider>
    );
};
