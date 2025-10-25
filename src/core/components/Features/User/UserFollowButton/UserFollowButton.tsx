import { FC, MouseEvent } from "react";
import Button from "@mui/material/Button";

interface UserFollowButtonProps {
    loading?: boolean;
    isFollowed: boolean;
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const UserFollowButton: FC<UserFollowButtonProps> = ({ isFollowed, onClick, loading }) => (
    <Button loading={loading} onClick={onClick} color="primary" variant={isFollowed ? "outlined" : "contained"}>
        {isFollowed ? "Subscribed" : "Subscribe"}
    </Button>
);
