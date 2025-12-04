import { FC, memo, MouseEvent } from "react";
import { ProfileReveal } from "@app/core/services";
import { UserListItemBase } from "@app/core/components";
import { RevokeProfileRevealButton } from "@app/core/components/Features/User/Reveals/RevealedProfiles/RevokeProfileRevealButton";

interface UserSummaryListItemProps {
    isLast: boolean;
    profileReveal: ProfileReveal;
    onListItemClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export const RevealedProfilesListItemComponent: FC<UserSummaryListItemProps> = ({
    isLast,
    profileReveal,
    onListItemClick,
}) => {
    const {
        id,
        revealedTo: { userName, fullName, isProfileIncognito, publicPhoto, privatePhoto, canViewFullProfile },
    } = profileReveal;
    const src: string | undefined = canViewFullProfile ? publicPhoto?.src : privatePhoto?.src;
    const alt: string = canViewFullProfile ? `avatar_${publicPhoto?.id}` : `avatar_${privatePhoto?.id}`;

    return (
        <UserListItemBase
            avatarUrl={src}
            avatarAlt={alt}
            isLast={isLast}
            userName={userName}
            fullName={fullName}
            onListItemClick={onListItemClick}
            isProfileIncognito={isProfileIncognito}
            action={<RevokeProfileRevealButton profileRevealId={id} userName={userName} />}
        />
    );
};

export const RevealedProfilesListItem = memo(RevealedProfilesListItemComponent);
