import { FC, MouseEvent } from "react";
import Button from "@mui/material/Button";
import { useIsMobile } from "@app/core/hooks";

interface UserFollowButtonProps {
    loading?: boolean;
    isFollowed: boolean;
    size?: "small" | "medium" | "large";
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const UserFollowButton: FC<UserFollowButtonProps> = ({ isFollowed, onClick, loading, size = "medium" }) => {
    const isMobile: boolean = useIsMobile();
    return (
        <Button
            color="primary"
            loading={loading}
            onClick={onClick}
            size={isMobile ? "small" : size}
            sx={{ minWidth: isMobile ? 90 : 110 }}
            variant={isFollowed ? "outlined" : "contained"}
        >
            {isFollowed ? "Subscribed" : "Subscribe"}
        </Button>
    );
};
