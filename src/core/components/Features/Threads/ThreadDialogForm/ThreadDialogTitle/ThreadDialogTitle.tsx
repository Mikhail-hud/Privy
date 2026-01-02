import { FC, SyntheticEvent } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface ThreadDialogTitleProps {
    isCreatingMode: boolean;
    handleClose: (event: SyntheticEvent) => void;
}
export const ThreadDialogTitle: FC<ThreadDialogTitleProps> = ({ isCreatingMode, handleClose }) => {
    return (
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
            <Typography variant="h4" color="primary" component="div">
                {isCreatingMode ? "Create Post" : "Edit Post"}
            </Typography>
            <IconButton onClick={handleClose} size="small">
                <CloseIcon />
            </IconButton>
        </DialogTitle>
    );
};
