import { FC, memo, MouseEvent } from "react";
import { UserListItemBase } from "@app/core/components";
import { RequesterRevealRequest } from "@app/core/services";
import { IncomingRevealRequestsActionButton } from "@app/core/components/Features/User/RevealsRequests/IncomingRequests/IncomingRevealRequestsActionButton";

interface IncomingRequestsListItemProps {
    isLast: boolean;
    revealRequest: RequesterRevealRequest;
    onListItemClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

const IncomingRequestsListItemComponent: FC<IncomingRequestsListItemProps> = ({
    isLast,
    revealRequest,
    onListItemClick,
}) => {
    const {
        id: requestId,
        requester: {
            userName,
            fullName,
            isProfileIncognito,
            publicPhoto,
            privatePhoto,
            canViewFullProfile,
            biography,
            followersCount,
            followingCount,
            isFollowedByCurrentUser,
        },
    } = revealRequest;
    const src: string | undefined = canViewFullProfile ? publicPhoto?.src : privatePhoto?.src;
    const alt: string = canViewFullProfile ? `avatar_${publicPhoto?.id}` : `avatar_${privatePhoto?.id}`;

    return (
        <UserListItemBase
            followersCount={followersCount}
            followingCount={followingCount}
            isFollowedByCurrentUser={isFollowedByCurrentUser}
            userProfileActionsShown
            isUserHoverCardShown
            biography={biography}
            avatarUrl={src}
            avatarAlt={alt}
            isLast={isLast}
            userName={userName}
            fullName={fullName}
            onListItemClick={onListItemClick}
            isProfileIncognito={isProfileIncognito}
            action={<IncomingRevealRequestsActionButton requestId={requestId} status={revealRequest.status} />}
        />
    );
};

export const IncomingRequestsListItem = memo(IncomingRequestsListItemComponent);
