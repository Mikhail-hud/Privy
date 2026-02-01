import Box from "@mui/material/Box";
import { FC, ChangeEvent, Ref } from "react";
import Tooltip from "@mui/material/Tooltip";
import GifIcon from "@mui/icons-material/Gif";
import IconButton from "@mui/material/IconButton";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import { POST_ACCEPT_ATTRIBUTE } from "@app/core/constants/patterns.ts";

interface ThreadActionIconsProps {
    fileInputRef: Ref<HTMLInputElement> | undefined;
    handleFileSelect?: (event: ChangeEvent<HTMLInputElement>) => void;
    handleAttachClick?: () => void;
    isProcessingFiles: boolean;
}

export const ThreadActionIcons: FC<ThreadActionIconsProps> = ({
    fileInputRef,
    handleFileSelect,
    handleAttachClick,
    isProcessingFiles,
}) => {
    return (
        <Box sx={{ display: "flex", gap: 1 }}>
            <input
                multiple
                type="file"
                ref={fileInputRef}
                accept={POST_ACCEPT_ATTRIBUTE}
                style={{ display: "none" }}
                onChange={handleFileSelect}
            />
            <Tooltip title="Attach Media" placement="top">
                <IconButton
                    size="small"
                    onClick={handleAttachClick}
                    sx={{ width: 26, height: 26 }}
                    disabled={isProcessingFiles}
                >
                    <PermMediaIcon sx={{ fontSize: 18 }} color="action" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Attach GIF" placement="top">
                <IconButton size="small" sx={{ width: 26, height: 26 }}>
                    <GifIcon sx={{ fontSize: 26 }} color="action" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Add Smile" placement="top">
                <IconButton size="small" sx={{ width: 26, height: 26 }}>
                    <AddReactionIcon sx={{ fontSize: 20 }} color="action" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Add Location" placement="top">
                <IconButton size="small" sx={{ width: 26, height: 26 }}>
                    <AddLocationAltIcon sx={{ fontSize: 20 }} color="action" />
                </IconButton>
            </Tooltip>
        </Box>
    );
};
