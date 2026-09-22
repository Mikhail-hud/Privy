import Box from "@mui/material/Box";
import { PrivateIcon } from "@app/core/assets/icons";
import { Avatar, UserAvatarBadge } from "@app/core/components";
import { FC } from "react";

interface ThreadDialogUserAvatarProps {
    isProfileIncognito: boolean;
    isCreatingMode: boolean;
    userName: string;
    avatarSrc?: string;
    isIncognito: boolean;
}

export const ThreadDialogUserAvatar: FC<ThreadDialogUserAvatarProps> = ({
    userName,
    isProfileIncognito,
    isIncognito,
    avatarSrc,
}) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {isIncognito ? (
                <PrivateIcon color="info" sx={{ width: 40, height: 40 }} />
            ) : (
                <UserAvatarBadge isProfileIncognito={isProfileIncognito}>
                    <Avatar src={avatarSrc} alt={userName} userName={userName} sx={{ width: 40, height: 40, mb: 1 }} />
                </UserAvatarBadge>
            )}
        </Box>
    );
};
