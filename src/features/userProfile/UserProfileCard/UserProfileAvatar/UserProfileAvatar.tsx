import { FC, useState } from "react";
import { Theme } from "@mui/material";
import Badge from "@mui/material/Badge";
import { User } from "@app/core/services";
import { Avatar } from "@app/core/components";
import { PrivateIcon, PublicIcon } from "@app/core/assets/icons";
import { UserAvatarBackdrop } from "@app/features/userProfile/UserProfileCard/UserProfileAvatar/UserAvatarBackdrop";

interface ProfileAvatarProps {
    user: User;
}

const avatarBadgeSx = (theme: Theme) => ({
    borderRadius: "50%",
    background: (theme.vars || theme).palette.background.paper,
    border: `1px solid ${(theme.vars || theme).palette.background.paper}`,
});

export const UserProfileAvatar: FC<ProfileAvatarProps> = ({ user }) => {
    const [open, setOpen] = useState<boolean>(false);

    const isProfileIncognito: boolean = user.isProfileIncognito;

    const src: string | undefined = isProfileIncognito ? user?.privatePhoto?.signedUrl : user?.publicPhoto?.signedUrl;
    const alt: string = isProfileIncognito ? `avata_${user?.privatePhoto?.id}` : `avata_${user?.publicPhoto?.id}`;

    const onAvatarClick = (): void => setOpen(true);

    const onClose = (): void => setOpen(false);

    return (
        <>
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                    isProfileIncognito ? (
                        <PrivateIcon color="info" fontSize="medium" sx={avatarBadgeSx} />
                    ) : (
                        <PublicIcon color="info" fontSize="medium" sx={avatarBadgeSx} />
                    )
                }
            >
                <Avatar
                    src={src}
                    alt={alt}
                    onClick={onAvatarClick}
                    userName={user?.userName}
                    sx={{ width: 120, height: 120, cursor: "pointer" }}
                />
            </Badge>
            <UserAvatarBackdrop
                src={src}
                alt={alt}
                open={open}
                onClose={onClose}
                userName={user.userName}
                isProfileIncognito={isProfileIncognito}
            />
        </>
    );
};
