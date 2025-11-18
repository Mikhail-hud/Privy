import { FC, MouseEvent } from "react";
import Button from "@mui/material/Button";
import { useIsMobile } from "@app/core/hooks";
import { enqueueSnackbar } from "notistack";
import { QueryError } from "@app/core/interfaces";
import { GENERIC_ERROR_MESSAGE } from "@app/core/constants/general.ts";
import { useFollowUserMutation, useUnFollowUserMutation } from "@app/core/services";

interface UserFollowButtonProps {
    isFollowed: boolean;
    userName: string;
    size?: "small" | "medium" | "large";
}

export const UserFollowButton: FC<UserFollowButtonProps> = memo(({ isFollowed, userName, size = "medium" }) => {
    const isMobile: boolean = useIsMobile();

    const [follow, { isLoading: isFollowLoading }] = useFollowUserMutation();
    const [unFollow, { isLoading: isUnfollowLoadinng }] = useUnFollowUserMutation();

    const handleFollow = async (userName: string): Promise<void> => {
        try {
            await follow({ userName }).unwrap();
        } catch (error) {
            const errorMessage: string = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    const handleUnfollow = async (userName: string): Promise<void> => {
        try {
            await unFollow({ userName }).unwrap();
        } catch (error) {
            const errorMessage: string = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
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
        >
            {isFollowed ? "Subscribed" : "Subscribe"}
        </Button>
    );
});
