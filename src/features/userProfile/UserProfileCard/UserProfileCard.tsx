import { FC } from "react";
import { User } from "@app/core/services";
import { ProfileCardContainer, UserStats } from "@app/core/components";
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
                    isProfileIncognito={isProfileIncognito}
                />
            }
            titleAction={<UserProfileActions userName={user.userName} isFollowed={user.isFollowedByCurrentUser} />}
            userName={userName}
            links={userlinks}
            interests={userInterests}
            fullName={fullName}
            biography={biography}
        />
    );
});
