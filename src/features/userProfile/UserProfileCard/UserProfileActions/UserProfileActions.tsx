import { FC } from "react";
import { UserFollowButton } from "@app/core/components";

interface UserProfileActionsProps {
    isFollowed: boolean;
    userName: string;
}

export const UserProfileActions: FC<UserProfileActionsProps> = ({ isFollowed, userName }) => {
    return <UserFollowButton isFollowed={isFollowed} userName={userName} />;
};
