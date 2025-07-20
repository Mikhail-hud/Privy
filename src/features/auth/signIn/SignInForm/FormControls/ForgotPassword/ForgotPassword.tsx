import { FC, FormEvent } from "react";
import { enqueueSnackbar } from "notistack";
import { useResetPasswordMutation } from "@app/core/services";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, TextField } from "@mui/material";

interface ForgotPasswordProps {
    open: boolean;
    handleClose: () => void;
}

export const ForgotPassword: FC<ForgotPasswordProps> = ({ open, handleClose }) => {
    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.stopPropagation();
        event.preventDefault();
        const formData: FormData = new FormData(event.currentTarget);
        const email: string = formData.get("email") as string;
        try {
            await resetPassword({ email }).unwrap();
            enqueueSnackbar("Password Reset link sent to your email address.", { variant: "success" });
            handleClose();
        } catch (error) {
            enqueueSnackbar(error.data.message?.toString(), { variant: "error" });
        }
    };
    return (
        <Dialog open={open} onClose={handleClose} slotProps={{ paper: { component: "form", onSubmit: handleSubmit } }}>
            <DialogTitle>Reset password</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                <DialogContentText>
                    Enter your account&apos;s email address, and we&apos;ll send you a link to reset your password.
                </DialogContentText>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="email"
                    name="email"
                    label="Email address"
                    placeholder="Email address"
                    type="email"
                    variant="outlined"
                    fullWidth
                    disabled={isLoading}
                />
            </DialogContent>
            <DialogActions sx={{ pb: 3, px: 3 }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" type="submit" loadingPosition="start" loading={isLoading}>
                    Continue
                </Button>
            </DialogActions>
        </Dialog>
    );
};
