import { FC, useState } from "react";
import { User } from "@app/core/services";
import { Avatar, UserAvatarBadge } from "@app/core/components";
import { UserAvatarBackdrop } from "@app/features/userProfile/UserProfileCard/UserProfileAvatar/UserAvatarBackdrop";

interface ProfileAvatarProps {
    user: User;
}

export const UserProfileAvatar: FC<ProfileAvatarProps> = ({ user }) => {
    const [open, setOpen] = useState<boolean>(false);
    const isProfileIncognito: boolean = user.isProfileIncognito;
    const src: string | undefined = isProfileIncognito ? user?.privatePhoto?.signedUrl : user?.publicPhoto?.signedUrl;
    const alt: string = isProfileIncognito ? `avata_${user?.privatePhoto?.id}` : `avata_${user?.publicPhoto?.id}`;

    const onAvatarClick = (): void => setOpen(true);

    const onClose = (): void => setOpen(false);

    return (
        <>
            <UserAvatarBadge fontSize="medium" isProfileIncognito={isProfileIncognito}>
                <Avatar
                    src={src}
                    alt={alt}
                    onClick={onAvatarClick}
                    userName={user.userName}
                    sx={{ width: 120, height: 120, cursor: "pointer" }}
                />
            </UserAvatarBadge>
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
