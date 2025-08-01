import { FC } from "react";
import { Box, Button } from "@mui/material";
import { UserGender } from "@app/core/services";
import { VALIDATE_RELES } from "@app/core/constants/rulesConstants";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Password, RememberMe } from "@app/features/auth/components/FormControls";
import { Navigation, SubmitFunction, useActionData, useNavigation, useSubmit } from "react-router-dom";
import { Age, Biography, Email, FullName, Gender, UserName } from "@app/features/auth/signUp/SignUpForm/FormControls";

export const SIGN_UP_FORM_FIELDS = {
    gender: { name: "gender", label: "Gender" },
    age: { name: "age", label: "Age" },
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
    [SIGN_UP_FORM_FIELDS.age.name]: number;
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
    [SIGN_UP_FORM_FIELDS.age.name]: null,
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
        defaultValues: DEFAULT_SIGN_UP_FORM_VALUES,
        mode: "onChange",
    });
    const { handleSubmit, setError, getValues, control } = form;

    const isSubmitting: boolean = navigation.state === "submitting";

    const onValidSubmit: SubmitHandler<SignUpFormValues> = data => {
        submit({ ...data }, { method: "post" });
    };

    useEffect((): void => {
        if (actionData?.errors) {
            for (const [field, message] of Object.entries(actionData.errors)) {
                setError(field as keyof SignUpFormValues, { message });
            }
        }
    }, [actionData]);

    return (
        <FormProvider {...form}>
            <Box
                noValidate
                method="post"
                component="form"
                onSubmit={handleSubmit(onValidSubmit)}
                sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 1 }}
            >
                <UserName />
                <Age />
                <Email />
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
                <FullName />
                <Biography />
                <Gender />
                <RememberMe
                    label={SIGN_UP_FORM_FIELDS.rememberMe.label}
                    name={SIGN_UP_FORM_FIELDS.rememberMe.name}
                    control={control}
                />
                <Button type="submit" fullWidth variant="contained" loadingPosition="start" loading={isSubmitting}>
                    Sign Up
                </Button>
            </Box>
        </FormProvider>
    );
};
