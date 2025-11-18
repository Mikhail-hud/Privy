import Button from "@mui/material/Button";
import { enqueueSnackbar } from "notistack";
import { useIsMobile } from "@app/core/hooks";
import { FC, MouseEvent, useState } from "react";
import { QueryError } from "@app/core/interfaces";
import { useRevokeProfileRevealMutation } from "@app/core/services";
import { GENERIC_ERROR_MESSAGE } from "@app/core/constants/general.ts";

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface RevokeProfileRevealButtonProps {
    profileRevealId: string;
    userName: string;
    size?: "small" | "medium" | "large";
}

export const RevokeProfileRevealButton: FC<RevokeProfileRevealButtonProps> = ({ size = "medium", userName }) => {
    const isMobile: boolean = useIsMobile();
    const [revokeRevial, { isLoading }] = useRevokeProfileRevealMutation();

    const [open, setOpen] = useState(false);

    const handleClickOpen = (_event: MouseEvent<HTMLButtonElement>): void => setOpen(true);

    const handleClose = (): void => setOpen(false);

    const handleRevokeConfirm = async (): Promise<void> => {
        try {
            await revokeRevial({ userName }).unwrap();
            enqueueSnackbar("Profile access revoked", { variant: "success" });
        } catch (error) {
            const errorMessage: string = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
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
                loading={isLoading}
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
                    <Button onClick={handleClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleRevokeConfirm} color="error" disabled={isLoading}>
                        {isLoading ? "Revoking..." : "Yes, revoke"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
