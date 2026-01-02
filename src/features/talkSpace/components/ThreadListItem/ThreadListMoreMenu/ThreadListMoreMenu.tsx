import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import { enqueueSnackbar } from "notistack";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemIcon from "@mui/material/ListItemIcon";
import { FC, memo, MouseEvent, useState } from "react";
import { ThreadDialogForm } from "@app/core/components";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CircularProgress from "@mui/material/CircularProgress";
import { stopEventPropagation } from "@app/core/utils/general.ts";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { ApiError, Thread, useDeleteThreadMutation } from "@app/core/services";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface ThreadListMoreMenuProps {
    thread: Thread;
}
const ThreadListMoreMenuComponent: FC<ThreadListMoreMenuProps> = ({ thread }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isMenuOpen: boolean = Boolean(anchorEl);

    const [open, setOpen] = useState(false);
    const [isUpdateThreadDialogOpen, setIsUpdateThreadDialogOpen] = useState<boolean>(false);

    const handleMenuClose = (_event: MouseEvent<HTMLElement>): void => setAnchorEl(null);
    const handleMenuOpen = (event: MouseEvent<HTMLElement>): void => {
        stopEventPropagation(event);
        setAnchorEl(event.currentTarget);
    };

    const handleDialogOpen = (event: MouseEvent<HTMLElement>): void => {
        setOpen(true);
        // Close the menu when opening the dialog
        handleMenuClose(event);
    };

    const handleDialogClose = (_event: MouseEvent<HTMLElement>): void => setOpen(false);

    const { mutateAsync: deleteThread, isPending: isDeleting } = useDeleteThreadMutation();

    const handleEdit = (event: MouseEvent<HTMLElement>): void => {
        setIsUpdateThreadDialogOpen(true);
        handleMenuClose(event);
    };

    const handleDelete = async (event: MouseEvent<HTMLElement>) => {
        try {
            await deleteThread(thread.id);
        } catch (error) {
            const errorMessage: string = (error as ApiError)?.message;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
        handleMenuClose(event);
    };

    const handleReport = (event: MouseEvent<HTMLElement>) => {
        handleMenuClose(event);
    };

    return (
        <>
            <ThreadDialogForm
                mode="edit"
                thread={thread}
                open={isUpdateThreadDialogOpen}
                setOpen={setIsUpdateThreadDialogOpen}
            />
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
                {thread.isOwnedByCurrentUser && (
                    <MenuItem onClick={handleEdit}>
                        <ListItemIcon>
                            <EditIcon fontSize="small" />
                        </ListItemIcon>
                        Edit
                    </MenuItem>
                )}
                {thread.isOwnedByCurrentUser && (
                    <MenuItem onClick={handleDialogOpen} sx={{ color: "error.main" }} disabled={isDeleting}>
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
                {!thread.isOwnedByCurrentUser && (
                    <MenuItem onClick={handleReport} sx={{ color: "error.main" }}>
                        <ListItemIcon>
                            <ReportProblemIcon fontSize="small" />
                        </ListItemIcon>
                        Report
                    </MenuItem>
                )}
            </Menu>
            <Dialog open={open} onClose={handleDialogClose} onClick={stopEventPropagation}>
                <DialogTitle variant="h3" color="primary">
                    Delete Post?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        If you delete this post, it will be removed from your profile and timeline. This action cannot
                        be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} disabled={isDeleting}>
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

export const ThreadListMoreMenu = memo(ThreadListMoreMenuComponent);
