import { enqueueSnackbar } from "notistack";
import { FC, MouseEvent, memo } from "react";
import { useIsMobile } from "@app/core/hooks";
import Button, { ButtonProps } from "@mui/material/Button";
import { ApiError, useFollowUserMutation, useUnFollowUserMutation } from "@app/core/services";

interface UserFollowButtonProps extends ButtonProps {
    isFollowed: boolean;
    userName: string;
}

export const UserFollowButtonComponent: FC<UserFollowButtonProps> = ({
    isFollowed,
    userName,
    size = "medium",
    ...rest
}) => {
    const isMobile: boolean = useIsMobile();

    const { mutateAsync: follow, isPending: isFollowLoading } = useFollowUserMutation();
    const { mutateAsync: unFollow, isPending: isUnfollowLoadinng } = useUnFollowUserMutation();

    const handleFollow = async (userName: string): Promise<void> => {
        try {
            await follow(userName);
        } catch (error) {
            const errorMessage: string = (error as ApiError)?.message;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    const handleUnfollow = async (userName: string): Promise<void> => {
        try {
            await unFollow(userName);
        } catch (error) {
            const errorMessage: string = (error as ApiError)?.message;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    const handleClick = async (_event: MouseEvent<HTMLButtonElement>): Promise<void> => {
        if (isFollowed) {
            await handleUnfollow(userName);
        } else {
            await handleFollow(userName);
        }
    };

    return (
        <Button
            color="primary"
            onClick={handleClick}
            size={isMobile ? "small" : size}
            sx={{ minWidth: isMobile ? 90 : 110 }}
            loading={isFollowLoading || isUnfollowLoadinng}
            variant={isFollowed ? "outlined" : "contained"}
            {...rest}
        >
            {isFollowed ? "Subscribed" : "Subscribe"}
        </Button>
    );
};

export const UserFollowButton = memo(UserFollowButtonComponent);
