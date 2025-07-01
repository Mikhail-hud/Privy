import { FC, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { Box, Link, Button } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Navigation, SubmitFunction, useActionData, useNavigation, useSubmit } from "react-router-dom";
import { Identifier, Password, RememberMe, ForgotPassword } from "@app/features/signIn/SignInForm/FormControls";

export enum SignInFormFields {
    IDENTIFIER = "identifier",
    PASSWORD = "password",
    REMEMBER_ME = "rememberMe",
}

export interface SignInFormValues {
    [SignInFormFields.IDENTIFIER]: string;
    [SignInFormFields.PASSWORD]: string;
    [SignInFormFields.REMEMBER_ME]: boolean;
}

export const SignInForm: FC = () => {
    const submit: SubmitFunction = useSubmit();
    const navigation: Navigation = useNavigation();
    const actionData = useActionData() as { error: string } | undefined;

    const form = useForm<SignInFormValues>();
    const { handleSubmit, setError } = form;

    const [open, setOpen] = useState<boolean>(false);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const isSubmitting: boolean = navigation.state === "submitting";

    const onValidSubmit: SubmitHandler<SignInFormValues> = data => {
        submit({ ...data }, { method: "post" });
    };

    useEffect((): void => {
        if (actionData?.error) {
            setError(SignInFormFields.IDENTIFIER, { message: actionData?.error });
            setError(SignInFormFields.PASSWORD, { message: actionData?.error });
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
                <Password />
                <RememberMe />
                <ForgotPassword open={open} handleClose={handleClose} />
                <Button type="submit" fullWidth variant="contained" disabled={isSubmitting}>
                    Sign in
                </Button>
                <Link
                    type="button"
                    variant="body2"
                    component="button"
                    onClick={handleClickOpen}
                    sx={{ alignSelf: "center" }}
                >
                    Forgot your password?
                </Link>
            </Box>
        </FormProvider>
    );
};
