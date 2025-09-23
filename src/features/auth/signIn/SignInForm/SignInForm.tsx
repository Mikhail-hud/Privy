import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import { useAuth } from "@app/core/hooks";
import { AuthActionData } from "@app/features";
import { FC, useState, MouseEvent } from "react";
import { VALIDATE_RELES } from "@app/core/constants/rulesConstants";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import { Identifier, Password, RememberMe } from "@app/core/components";
import { isValidEmail, isValidUsername } from "@app/core/utils/authUtils";
import { Navigation, useActionData, useNavigation } from "react-router-dom";
import { ForgotPassword, TwoFactor } from "@app/features/auth/signIn/SignInForm/FormControls";

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

const DEFAULT_SIGN_IN_FORM_VALUES: SignInFormValues = {
    [SIGN_IN_FORM_FIELDS.identifier.name]: "",
    [SIGN_IN_FORM_FIELDS.password.name]: "",
    [SIGN_IN_FORM_FIELDS.rememberMe.name]: false,
};

const transformErrors = (credentialsError?: string): FieldErrors<SignInFormValues> | undefined => {
    if (!credentialsError) return undefined;

    return {
        [SIGN_IN_FORM_FIELDS.identifier.name]: { type: "manual", message: credentialsError },
        [SIGN_IN_FORM_FIELDS.password.name]: { type: "manual", message: credentialsError },
    };
};

export const SignInForm: FC = () => {
    const { signIn } = useAuth();
    const navigation: Navigation = useNavigation();
    const actionData = useActionData() as AuthActionData;

    const form = useForm<SignInFormValues>({
        defaultValues: DEFAULT_SIGN_IN_FORM_VALUES,
        errors: transformErrors(actionData?.credentialsError),
    });

    const { handleSubmit, control } = form;
    const [open, setOpen] = useState<boolean>(false);

    const handleClickOpen = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const isSubmitting: boolean = navigation.state === "submitting";

    const onValidSubmit: SubmitHandler<SignInFormValues> = data => signIn(data);

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
