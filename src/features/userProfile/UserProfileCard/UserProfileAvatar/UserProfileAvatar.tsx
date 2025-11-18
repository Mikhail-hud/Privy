import { FC, useState } from "react";
import { Photo } from "@app/core/services";
import { Avatar, UserAvatarBadge } from "@app/core/components";
import { UserAvatarBackdrop } from "@app/features/userProfile/UserProfileCard/UserProfileAvatar/UserAvatarBackdrop";

interface ProfileAvatarProps {
    userName: string;
    canViewFullProfile: boolean;
    isProfileIncognito: boolean;
    privatePhoto: Photo | null | undefined;
    publicPhoto: Photo | null | undefined;
}

export const UserProfileAvatar: FC<ProfileAvatarProps> = memo(
    ({ privatePhoto, publicPhoto, isProfileIncognito, userName, canViewFullProfile }) => {
        const [open, setOpen] = useState<boolean>(false);
        const src: string | undefined = canViewFullProfile ? publicPhoto?.signedUrl : privatePhoto?.signedUrl;
        const alt: string = canViewFullProfile ? `avatar_${publicPhoto?.id}` : `avatar_${privatePhoto?.id}`;

        const onAvatarClick = (): void => setOpen(true);

        const onClose = (): void => setOpen(false);

        return (
            <>
                <UserAvatarBadge fontSize="medium" isProfileIncognito={isProfileIncognito}>
                    <Avatar
                        src={src}
                        alt={alt}
                        userName={userName}
                        onClick={onAvatarClick}
                        sx={{ width: 120, height: 120, cursor: "pointer" }}
                    />
                </UserAvatarBadge>
                <UserAvatarBackdrop
                    src={src}
                    alt={alt}
                    open={open}
                    onClose={onClose}
                    userName={userName}
                    isProfileIncognito={isProfileIncognito}
                />
            </>
        );
    }
);
