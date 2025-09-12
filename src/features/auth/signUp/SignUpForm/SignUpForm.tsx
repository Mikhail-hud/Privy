import { FC } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { UserGender } from "@app/core/services";
import { SubmitHandler, useForm } from "react-hook-form";
import { transformServerErrors } from "@app/core/utils/general";
import { VALIDATE_RELES } from "@app/core/constants/rulesConstants";
import { Navigation, SubmitFunction, useActionData, useNavigation, useSubmit } from "react-router-dom";
import { BirthDate, UserName, Email, Password, RememberMe, FullName, Biography, Gender } from "@app/core/components";

export const SIGN_UP_FORM_FIELDS = {
    gender: { name: "gender", label: "Gender" },
    birthDate: { name: "birthDate", label: "Birthdate" },
    fullName: { name: "fullName", label: "Full Name" },
    userName: { name: "userName", label: "User Name" },
    password: { name: "password", label: "Password" },
    rememberMe: { name: "rememberMe", label: "Remember Me" },
    email: { name: "email", label: "Email" },
    biography: { name: "biography", label: "Biography" },
    passwordRepeat: { name: "passwordRepeat", label: "Repeat Password" },
} as const;

export interface SignUpFormValues {
    [SIGN_UP_FORM_FIELDS.gender.name]: UserGender;
    [SIGN_UP_FORM_FIELDS.birthDate.name]: string | null;
    [SIGN_UP_FORM_FIELDS.biography.name]: string;
    [SIGN_UP_FORM_FIELDS.fullName.name]: string;
    [SIGN_UP_FORM_FIELDS.userName.name]: string;
    [SIGN_UP_FORM_FIELDS.email.name]: string;
    [SIGN_UP_FORM_FIELDS.password.name]: string;
    [SIGN_UP_FORM_FIELDS.passwordRepeat.name]: string;
    [SIGN_UP_FORM_FIELDS.rememberMe.name]: boolean;
}

const DEFAULT_SIGN_UP_FORM_VALUES: SignUpFormValues = {
    [SIGN_UP_FORM_FIELDS.gender.name]: UserGender.OTHER,
    [SIGN_UP_FORM_FIELDS.birthDate.name]: null,
    [SIGN_UP_FORM_FIELDS.fullName.name]: "",
    [SIGN_UP_FORM_FIELDS.userName.name]: "",
    [SIGN_UP_FORM_FIELDS.email.name]: "",
    [SIGN_UP_FORM_FIELDS.password.name]: "",
    [SIGN_UP_FORM_FIELDS.passwordRepeat.name]: "",
    [SIGN_UP_FORM_FIELDS.biography.name]: "",
    [SIGN_UP_FORM_FIELDS.rememberMe.name]: true,
};

export const SignUpForm: FC = () => {
    const submit: SubmitFunction = useSubmit();
    const navigation: Navigation = useNavigation();
    const actionData = useActionData() as { error: string; errors: Record<string, string> };

    const form = useForm<SignUpFormValues>({
        mode: "onChange",
        defaultValues: DEFAULT_SIGN_UP_FORM_VALUES,
        errors: transformServerErrors<SignUpFormValues>(actionData?.errors),
    });
    const { handleSubmit, getValues, control } = form;

    const isSubmitting: boolean = navigation.state === "submitting";

    const onValidSubmit: SubmitHandler<SignUpFormValues> = data => {
        submit({ ...data }, { method: "post" });
    };

    return (
        <Box
            noValidate
            method="post"
            component="form"
            onSubmit={handleSubmit(onValidSubmit)}
            sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}
        >
            <UserName<SignUpFormValues>
                control={control}
                rules={VALIDATE_RELES.USER_NAME}
                name={SIGN_UP_FORM_FIELDS.userName.name}
                label={SIGN_UP_FORM_FIELDS.userName.label}
            />
            <BirthDate<SignUpFormValues>
                control={control}
                name={SIGN_UP_FORM_FIELDS.birthDate.name}
                label={SIGN_UP_FORM_FIELDS.birthDate.label}
            />
            <Email<SignUpFormValues>
                control={control}
                rules={VALIDATE_RELES.EMAIL}
                label={SIGN_UP_FORM_FIELDS.email.label}
                name={SIGN_UP_FORM_FIELDS.email.name}
            />
            <Password<SignUpFormValues>
                control={control}
                rules={VALIDATE_RELES.PASSWORD}
                name={SIGN_UP_FORM_FIELDS.password.name}
                label={SIGN_UP_FORM_FIELDS.password.label}
                autoComplete="new-password"
                placeholder="Password must be at least 6 characters long"
            />
            <Password<SignUpFormValues>
                control={control}
                autoComplete="new-password"
                placeholder="Repeat your password"
                label={SIGN_UP_FORM_FIELDS.passwordRepeat.label}
                name={SIGN_UP_FORM_FIELDS.passwordRepeat.name}
                rules={{
                    ...VALIDATE_RELES.PASSWORD_REPEAT,
                    validate: value => {
                        if (value !== getValues(SIGN_UP_FORM_FIELDS.password.name)) {
                            return "Passwords do not match";
                        }
                        return true;
                    },
                }}
            />
            <FullName<SignUpFormValues>
                control={control}
                rules={VALIDATE_RELES.FULL_NAME}
                name={SIGN_UP_FORM_FIELDS.fullName.name}
                label={SIGN_UP_FORM_FIELDS.fullName.label}
            />
            <Biography<SignUpFormValues>
                control={control}
                rules={VALIDATE_RELES.BIOGRAPHY}
                name={SIGN_UP_FORM_FIELDS.biography.name}
                label={SIGN_UP_FORM_FIELDS.biography.label}
            />
            <Gender<SignUpFormValues>
                control={control}
                name={SIGN_UP_FORM_FIELDS.gender.name}
                label={SIGN_UP_FORM_FIELDS.gender.label}
            />
            <RememberMe<SignUpFormValues>
                control={control}
                label={SIGN_UP_FORM_FIELDS.rememberMe.label}
                name={SIGN_UP_FORM_FIELDS.rememberMe.name}
            />
            <Button type="submit" fullWidth variant="contained" loadingPosition="start" loading={isSubmitting}>
                Sign Up
            </Button>
        </Box>
    );
};
