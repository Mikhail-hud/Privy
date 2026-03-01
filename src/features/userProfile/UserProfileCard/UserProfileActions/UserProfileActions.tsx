import { FC } from "react";
import { ButtonProps } from "@mui/material/Button";
import { UserFollowButton } from "@app/core/components";

interface UserProfileActionsProps extends ButtonProps {
    isFollowed: boolean;
    userName: string;
}

export const UserProfileActions: FC<UserProfileActionsProps> = ({ isFollowed, userName, ...rest }) => {
    return <UserFollowButton isFollowed={isFollowed} userName={userName} {...rest} />;
};
