import Button from "@mui/material/Button";
import { enqueueSnackbar } from "notistack";
import { useIsMobile } from "@app/core/hooks";
import { FC, MouseEvent, useState } from "react";
import { UserHoverCard } from "@app/core/components";
import { ApiError, useRevokeProfileRevealMutation } from "@app/core/services";

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Typography from "@mui/material/Typography";

interface RevokeProfileRevealButtonProps {
    profileRevealId: string;
    userName: string;
    size?: "small" | "medium" | "large";
    src?: string;
    fullName?: string;
    isProfileIncognito?: boolean;
    followersCount?: number;
    followingCount?: number;
    biography?: string;
    isFollowedByCurrentUser?: boolean;
}

export const RevokeProfileRevealButton: FC<RevokeProfileRevealButtonProps> = ({
    size = "medium",
    userName,
    src,
    fullName,
    isProfileIncognito,
    followersCount,
    followingCount,
    biography,
    isFollowedByCurrentUser,
}) => {
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
    return (
        <>
            <Button
                style={{ minWidth: "100px" }}
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
                        Are you sure you want to revoke access to your profile for{" "}
                        <UserHoverCard
                            src={src}
                            disabled={false}
                            userName={userName}
                            fullName={fullName}
                            userProfileActionsShown
                            biography={biography}
                            followersCount={followersCount}
                            followingCount={followingCount}
                            isProfileIncognito={isProfileIncognito}
                            isFollowedByCurrentUser={isFollowedByCurrentUser}
                        >
                            <Typography
                                variant="subtitle2"
                                color="primary"
                                sx={{
                                    cursor: "pointer",
                                    "&:hover": { textDecoration: "underline" },
                                }}
                            >
                                @{userName}
                            </Typography>
                        </UserHoverCard>
                        ? This user will no longer be able to see your private information.
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
