import { FC } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { enqueueSnackbar } from "notistack";
import { Email } from "@app/core/components";
import { QueryError } from "@app/core/interfaces";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useForm, SubmitHandler } from "react-hook-form";
import DialogActions from "@mui/material/DialogActions";
import { useResetPasswordMutation } from "@app/core/services";
import DialogContentText from "@mui/material/DialogContentText";
import { GENERIC_ERROR_MESSAGE } from "@app/core/constants/general";
import { VALIDATE_RELES } from "@app/core/constants/rulesConstants";

export const FORGOT_PASSWOR_FIELDS = {
    email: { name: "email", label: "Email" },
} as const;

interface ForgotPasswordValues {
    [FORGOT_PASSWOR_FIELDS.email.name]: string;
}

const FORGOT_PASSWOR_FORM_VALUES: ForgotPasswordValues = {
    [FORGOT_PASSWOR_FIELDS.email.name]: "",
};

interface ForgotPasswordProps {
    open: boolean;
    handleClose: () => void;
}

export const ForgotPassword: FC<ForgotPasswordProps> = ({ open, handleClose }) => {
    const [resetPassword, { isLoading }] = useResetPasswordMutation();
    const emailInputRef = useRef<HTMLInputElement>(null);

    const { control, handleSubmit, setError } = useForm<ForgotPasswordValues>({
        defaultValues: FORGOT_PASSWOR_FORM_VALUES,
    });

    const handleDialogEntered = (): void => emailInputRef.current?.focus();

    const onValidSubmit: SubmitHandler<ForgotPasswordValues> = async (data): Promise<void> => {
        const { email } = data;
        try {
            await resetPassword({ email }).unwrap();
            enqueueSnackbar("Password Reset link sent to your email address.", { variant: "success" });
            handleClose();
        } catch (error) {
            setError("email", {
                message: (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE,
            });
            enqueueSnackbar((error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE, {
                variant: "error",
            });
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            slotProps={{
                paper: { component: "form" },
                transition: { onEntered: handleDialogEntered },
            }}
        >
            <DialogTitle variant="h3" color="primary">
                Reset password
            </DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                <DialogContentText>
                    Enter your account&apos;s email address, and we&apos;ll send you a link to reset your password.
                </DialogContentText>
                <Email<ForgotPasswordValues>
                    control={control}
                    inputRef={emailInputRef}
                    rules={VALIDATE_RELES.EMAIL}
                    name={FORGOT_PASSWOR_FIELDS.email.name}
                    label={FORGOT_PASSWOR_FIELDS.email.label}
                />
            </DialogContent>
            <DialogActions sx={{ pb: 3, px: 3 }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    variant="contained"
                    loading={isLoading}
                    loadingPosition="start"
                    onClick={handleSubmit(onValidSubmit)}
                >
                    Continue
                </Button>
            </DialogActions>
        </Dialog>
    );
};
