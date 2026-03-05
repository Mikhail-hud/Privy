import { FC, memo, MouseEvent } from "react";
import { ProfileRevealByMe } from "@app/core/services";
import { UserListItemBase } from "@app/core/components";
import { RevokeProfileRevealButton } from "@app/core/components/Features/User/ProfileReveals/RevealedByMeRequests/RevokeProfileRevealButton";

interface AcceptedRequestsListItemProps {
    isLast: boolean;
    revealRequest: ProfileRevealByMe;
    onListItemClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

const RevealedByMeRequestsListItemComponent: FC<AcceptedRequestsListItemProps> = ({
    isLast,
    revealRequest,
    onListItemClick,
}) => {
    const {
        id,
        revealedTo: {
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
                <RevokeProfileRevealButton
                    profileRevealId={id}
                    userName={userName}
                    src={src}
                    fullName={fullName}
                    isProfileIncognito={isProfileIncognito}
                    followersCount={followersCount}
                    followingCount={followingCount}
                    biography={biography}
                    isFollowedByCurrentUser={isFollowedByCurrentUser}
                />
            }
        />
    );
};

export const RevealedByMeRequestsListItem = memo(RevealedByMeRequestsListItemComponent);
