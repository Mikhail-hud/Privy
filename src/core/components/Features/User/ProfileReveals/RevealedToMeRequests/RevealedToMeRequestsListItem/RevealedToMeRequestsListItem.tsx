import { FC, memo, MouseEvent } from "react";
import { ProfileRevealToMe } from "@app/core/services";
import { UserListItemBase } from "@app/core/components";

interface AcceptedRequestsListItemProps {
    isLast: boolean;
    revealRequest: ProfileRevealToMe;
    onListItemClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

const RevealedToMeRequestsListItemComponent: FC<AcceptedRequestsListItemProps> = ({
    isLast,
    revealRequest,
    onListItemClick,
}) => {
    const {
        revealer: { userName, fullName, isProfileIncognito, publicPhoto, privatePhoto, canViewFullProfile },
    } = revealRequest;
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
        />
    );
};

export const RevealedToMeRequestsListItem = memo(RevealedToMeRequestsListItemComponent);
