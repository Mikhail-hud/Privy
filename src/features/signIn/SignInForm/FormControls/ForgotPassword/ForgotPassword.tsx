import { FC, FormEvent } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, TextField } from "@mui/material";

interface ForgotPasswordProps {
    open: boolean;
    handleClose: () => void;
}

export const ForgotPassword: FC<ForgotPasswordProps> = ({ open, handleClose }) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            slotProps={{
                paper: {
                    component: "form",
                    onSubmit: (event: FormEvent<HTMLFormElement>): void => {
                        event.preventDefault();
                        handleClose();
                    },
                },
            }}
        >
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
                />
            </DialogContent>
            <DialogActions sx={{ pb: 3, px: 3 }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" type="submit">
                    Continue
                </Button>
            </DialogActions>
        </Dialog>
    );
};
