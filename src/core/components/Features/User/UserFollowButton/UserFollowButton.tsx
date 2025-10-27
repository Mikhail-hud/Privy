import { FC, MouseEvent } from "react";
import Button from "@mui/material/Button";

interface UserFollowButtonProps {
    loading?: boolean;
    isFollowed: boolean;
    size?: "small" | "medium" | "large";
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const UserFollowButton: FC<UserFollowButtonProps> = ({ isFollowed, onClick, loading, size = "medium" }) => (
    <Button
        size={size}
        color="primary"
        loading={loading}
        onClick={onClick}
        variant={isFollowed ? "outlined" : "contained"}
    >
        {isFollowed ? "Subscribed" : "Subscribe"}
    </Button>
);
