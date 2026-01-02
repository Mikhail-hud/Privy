import Button from "@mui/material/Button";
import { enqueueSnackbar } from "notistack";
import { useIsMobile } from "@app/core/hooks";
import { FC, MouseEvent, useState } from "react";
import { ApiError, useRevokeProfileRevealMutation } from "@app/core/services";

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface RevokeProfileRevealButtonProps {
    profileRevealId: string;
    userName: string;
    size?: "small" | "medium" | "large";
}

export const RevokeProfileRevealButton: FC<RevokeProfileRevealButtonProps> = ({ size = "medium", userName }) => {
    const isMobile: boolean = useIsMobile();
    const { mutateAsync: revokeRevial, isPending } = useRevokeProfileRevealMutation();

    const [open, setOpen] = useState(false);

    const handleClickOpen = (_event: MouseEvent<HTMLButtonElement>): void => setOpen(true);

    const handleClose = (): void => setOpen(false);

    const handleRevokeConfirm = async (): Promise<void> => {
        try {
            await revokeRevial(userName);
            enqueueSnackbar("Profile access revoked", { variant: "success" });
        } catch (error) {
            const errorMessage: string = (error as ApiError)?.message;
            enqueueSnackbar(errorMessage, { variant: "error" });
        } finally {
            handleClose();
        }
    };

    // TODO Added Profile Details dialog

    return (
        <>
            <Button
                color="primary"
                loading={isPending}
                variant="contained"
                onClick={handleClickOpen}
                size={isMobile ? "small" : size}
            >
                Revoke Reveal
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle variant="h3" color="primary">
                    Revoke Access?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to revoke access to your profile for <strong>@{userName}?</strong> This
                        user will no longer be able to see your private information.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button onClick={handleRevokeConfirm} variant="outlined" color="error" disabled={isPending}>
                        {isPending ? "Revoking..." : "Yes, revoke"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
