import { FC } from "react";
import { User } from "@app/core/services";
import { ProfileCardContainer, UserProfileLock, UserStats } from "@app/core/components";
import { UserProfileAvatar } from "@app/features/userProfile/UserProfileCard/UserProfileAvatar";
import { UserProfileActions } from "@app/features/userProfile/UserProfileCard/UserProfileActions";

interface ProfileCardProps {
    user: User;
}

export const UserProfileCard: FC<ProfileCardProps> = memo(({ user }) => {
    const {
        userName,
        followingCount,
        followersCount,
        links,
        interests,
        isProfileIncognito,
        privatePhoto,
        publicPhoto,
        fullName,
        biography,
        revealRequestStatus,
        canViewFullProfile,
    } = user;
    const userlinks = useMemo(() => links, [links]);
    const userInterests = useMemo(() => interests, [interests]);

    return (
        <ProfileCardContainer
            cardAction={
                <UserStats followersCount={followersCount} followingCount={followingCount} userName={userName} />
            }
            avatar={
                <UserProfileAvatar
                    userName={userName}
                    publicPhoto={publicPhoto}
                    privatePhoto={privatePhoto}
                    canViewFullProfile={canViewFullProfile}
                    isProfileIncognito={isProfileIncognito}
                />
            }
            titleAction={<UserProfileActions userName={user.userName} isFollowed={user.isFollowedByCurrentUser} />}
            links={userlinks}
            userName={userName}
            fullName={fullName}
            biography={biography}
            interests={userInterests}
        >
            {!canViewFullProfile && <UserProfileLock userName={userName} status={revealRequestStatus?.status} />}
        </ProfileCardContainer>
    );
});
