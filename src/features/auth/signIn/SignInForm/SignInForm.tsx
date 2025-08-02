import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { FC, useState, MouseEvent, useEffect } from "react";
import { VALIDATE_RELES } from "@app/core/constants/rulesConstants";
import { Identifier, Password, RememberMe } from "@app/core/components";
import { isValidEmail, isValidUsername } from "@app/core/utils/authUtils";
import { AuthActionData, SIGN_IN_ACTION_KEY, SIGN_IN_WITH_CREDENTIALS } from "@app/features";
import { ForgotPassword, TwoFactor } from "@app/features/auth/signIn/SignInForm/FormControls";
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
        <Box
            noValidate
            method="post"
            component="form"
            onSubmit={handleSubmit(onValidSubmit)}
            sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}
        >
            <Identifier<SignInFormValues>
                control={control}
                name={SIGN_IN_FORM_FIELDS.identifier.name}
                label={SIGN_IN_FORM_FIELDS.identifier.label}
                rules={{
                    required: "Identifier is required",
                    validate: (value: string | boolean) => {
                        if (typeof value === "string" && value.includes("@")) {
                            return isValidEmail(value) || "Wrong email format";
                        }
                        return isValidUsername(value as string) || "Wrong username format";
                    },
                }}
            />
            <Password<SignInFormValues>
                control={control}
                placeholder="Enter your password"
                autoComplete="current-password"
                rules={VALIDATE_RELES.PASSWORD}
                name={SIGN_IN_FORM_FIELDS.password.name}
                label={SIGN_IN_FORM_FIELDS.password.label}
            />
            <RememberMe<SignInFormValues>
                control={control}
                label={SIGN_IN_FORM_FIELDS.rememberMe.label}
                name={SIGN_IN_FORM_FIELDS.rememberMe.name}
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
    );
};
