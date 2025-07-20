import { enqueueSnackbar } from "notistack";
import { FC, useState, MouseEvent } from "react";
import { Box, Link, Button } from "@mui/material";
import { VALIDATE_RELES } from "@app/core/constants/rulesConstants";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Password, RememberMe } from "@app/features/auth/components/FormControls";
import { Identifier, ForgotPassword } from "@app/features/auth/signIn/SignInForm/FormControls";
import { Navigation, SubmitFunction, useActionData, useNavigation, useSubmit } from "react-router-dom";

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
    const actionData = useActionData() as { error: string } | undefined;

    const form = useForm<SignInFormValues>();
    const { handleSubmit, setError } = form;

    const [open, setOpen] = useState<boolean>(false);

    const handleClickOpen = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const isSubmitting: boolean = navigation.state === "submitting";

    const onValidSubmit: SubmitHandler<SignInFormValues> = data => {
        submit({ ...data }, { method: "post" });
    };

    useEffect((): void => {
        if (actionData?.error) {
            setError(SIGN_IN_FORM_FIELDS.identifier.name, { message: actionData?.error });
            setError(SIGN_IN_FORM_FIELDS.password.name, { message: actionData?.error });
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
                <Identifier />
                <Password<SignInFormValues>
                    name={SIGN_IN_FORM_FIELDS.password.name}
                    label={SIGN_IN_FORM_FIELDS.password.label}
                    autoComplete="current-password"
                    registerOptions={{
                        required: "Password is required",
                        minLength: VALIDATE_RELES.PASSWORD.minLength,
                        maxLength: VALIDATE_RELES.PASSWORD.maxLength,
                    }}
                />
                <RememberMe label={SIGN_IN_FORM_FIELDS.rememberMe.label} name={SIGN_IN_FORM_FIELDS.rememberMe.name} />
                <ForgotPassword open={open} handleClose={handleClose} />
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
