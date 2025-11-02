import { FC } from "react";
import { User } from "@app/core/services";
import { ProfileCardContainer } from "@app/core/components";
import { UserProfileAvatar } from "@app/features/userProfile/UserProfileCard/UserProfileAvatar";
import { UserProfileActions } from "@app/features/userProfile/UserProfileCard/UserProfileActions";

interface ProfileCardProps {
    user: User;
}

export const UserProfileCard: FC<ProfileCardProps> = memo(({ user }) => {
    return (
        <ProfileCardContainer
            avatar={<UserProfileAvatar user={user} />}
            titleAction={<UserProfileActions userName={user.userName} isFollowed={user.isFollowedByCurrentUser} />}
            {...user}
        />
    );
});
