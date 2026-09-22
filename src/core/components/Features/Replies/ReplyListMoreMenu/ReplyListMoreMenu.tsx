import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import { enqueueSnackbar } from "notistack";
import { useAuth } from "@app/core/hooks";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemIcon from "@mui/material/ListItemIcon";
import { FC, memo, MouseEvent, useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CircularProgress from "@mui/material/CircularProgress";
import { stopEventPropagation } from "@app/core/utils/general.ts";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { ApiError, Reply, useDeleteReplyMutation, UserRole } from "@app/core/services";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface ReplyListMoreMenuProps {
    reply: Reply;
}

const ReplyListMoreMenuComponent: FC<ReplyListMoreMenuProps> = ({ reply }) => {
    const {
        profile: { role },
    } = useAuth();

    const canDeleteReply: boolean =
        reply.isOwnedByCurrentUser || role === UserRole.ADMIN || role === UserRole.MODERATOR;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isMenuOpen: boolean = Boolean(anchorEl);

    const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

    const { mutateAsync: deleteReply, isPending: isDeleting } = useDeleteReplyMutation();

    const handleMenuClose = (_event: MouseEvent<HTMLElement>): void => setAnchorEl(null);
    const handleMenuOpen = (event: MouseEvent<HTMLElement>): void => {
        stopEventPropagation(event);
        setAnchorEl(event.currentTarget);
    };

    const handleConfirmOpen = (event: MouseEvent<HTMLElement>): void => {
        setIsConfirmOpen(true);
        handleMenuClose(event);
    };

    const handleConfirmClose = (_event: MouseEvent<HTMLElement>): void => setIsConfirmOpen(false);

    const handleDelete = async (event: MouseEvent<HTMLElement>): Promise<void> => {
        try {
            await deleteReply({ id: reply.id, threadId: reply.threadId });
            enqueueSnackbar("Reply deleted successfully", { variant: "success" });
            setIsConfirmOpen(false);
        } catch (error) {
            const errorMessage: string = (error as ApiError)?.message;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
        handleMenuClose(event);
    };

    const handleReport = (event: MouseEvent<HTMLElement>): void => handleMenuClose(event);

    return (
        <>
            <IconButton size="small" onClick={handleMenuOpen}>
                <MoreHorizIcon fontSize="small" />
            </IconButton>
            <Menu
                open={isMenuOpen}
                anchorEl={anchorEl}
                onClose={handleMenuClose}
                onClick={stopEventPropagation}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                {canDeleteReply && (
                    <MenuItem onClick={handleConfirmOpen} sx={{ color: "error.main" }} disabled={isDeleting}>
                        <ListItemIcon>
                            {isDeleting ? (
                                <CircularProgress size={16} color="inherit" />
                            ) : (
                                <DeleteIcon fontSize="small" />
                            )}
                        </ListItemIcon>
                        Delete
                    </MenuItem>
                )}
                {!reply.isOwnedByCurrentUser && (
                    <MenuItem onClick={handleReport} sx={{ color: "error.main" }}>
                        <ListItemIcon>
                            <ReportProblemIcon fontSize="small" />
                        </ListItemIcon>
                        Report
                    </MenuItem>
                )}
            </Menu>
            <Dialog open={isConfirmOpen} onClose={handleConfirmClose} onClick={stopEventPropagation}>
                <DialogTitle variant="h3" color="primary">
                    Delete Reply?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Deleting this reply also deletes every reply beneath it. This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} variant="outlined" color="error" disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export const ReplyListMoreMenu = memo(ReplyListMoreMenuComponent);
