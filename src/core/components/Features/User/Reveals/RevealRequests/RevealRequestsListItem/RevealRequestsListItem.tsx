import { FC, memo, MouseEvent } from "react";
import { RevealRequest } from "@app/core/services";
import { UserListItemBase } from "@app/core/components";
import { RevealRequestsButtonGroup } from "@app/core/components/Features/User/Reveals/RevealRequests/RevealRequestsButtonGroup";

interface UserSummaryListItemProps {
    isLast: boolean;
    revealRequest: RevealRequest;
    onListItemClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export const RevealRequestsListItemComponent: FC<UserSummaryListItemProps> = ({
    isLast,
    revealRequest,
    onListItemClick,
}) => {
    const {
        id: requesterId,
        requester: { userName, fullName, isProfileIncognito, publicPhoto, privatePhoto, canViewFullProfile },
    } = revealRequest;
    const src: string | undefined = canViewFullProfile ? publicPhoto?.signedUrl : privatePhoto?.signedUrl;
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
            action={<RevealRequestsButtonGroup requestId={requesterId} status={revealRequest.status} />}
        />
    );
};

export const RevealRequestsListItem = memo(RevealRequestsListItemComponent);
