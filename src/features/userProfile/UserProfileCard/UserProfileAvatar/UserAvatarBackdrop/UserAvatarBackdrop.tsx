import React from "react";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { ActionIconButton, Avatar } from "@app/core/components";
import { PrivateIcon, PublicIcon } from "@app/core/assets/icons";

interface UserAvatarBackdropContentProps {
    onClose: () => void;
    open: boolean;
    isProfileIncognito: boolean;
    src: string | undefined;
    alt: string;
    userName: string;
}

export const UserAvatarBackdrop: React.FC<UserAvatarBackdropContentProps> = ({
    src,
    isProfileIncognito,
    onClose,
    open,
    userName,
    alt,
}) => {
    return (
        <Backdrop open={open} sx={{ zIndex: theme => theme.zIndex.drawer + 1, background: "black" }}>
            <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
                <Box sx={{ p: 2, width: "100%", display: "flex", justifyContent: "space-between" }}>
                    <ActionIconButton icon={<CloseIcon />} onClick={onClose} />
                    <Typography component="h1" variant="h3" color="white">
                        {isProfileIncognito ? (
                            <PrivateIcon sx={{ color: "primary.main" }} />
                        ) : (
                            <PublicIcon sx={{ color: "primary.main" }} />
                        )}
                    </Typography>
                </Box>
                <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {src ? (
                        <img src={src} alt={alt} style={{ maxWidth: "80vw", maxHeight: "80vh", borderRadius: "2px" }} />
                    ) : (
                        <Avatar
                            src={src}
                            alt={alt}
                            userName={userName}
                            sx={{ width: 250, height: 250 }}
                            skeleton={{ width: 250, height: 250 }}
                        />
                    )}
                </Box>
            </Box>
        </Backdrop>
    );
};
