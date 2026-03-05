import { FC, memo, MouseEvent } from "react";
import { UserListItemBase } from "@app/core/components";
import { RequesteeRevealRequest, RevealStatus } from "@app/core/services";
import { OutgoingRequestsActionButton } from "@app/core/components/Features/User/RevealsRequests/OutgoingRequests/OutgoingRequestsActionButton";

interface OutgoingRequestsListItemProps {
    isLast: boolean;
    revealRequest: RequesteeRevealRequest;
    onListItemClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

const OutgoingRequestsListItemComponent: FC<OutgoingRequestsListItemProps> = ({
    isLast,
    revealRequest,
    onListItemClick,
}) => {
    const {
        status,
        requestee: {
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
            action={
                status === RevealStatus.PENDING ? (
                    <OutgoingRequestsActionButton userName={userName} status={status} />
                ) : undefined
            }
        />
    );
};

export const OutgoingRequestsListItem = memo(OutgoingRequestsListItemComponent);
