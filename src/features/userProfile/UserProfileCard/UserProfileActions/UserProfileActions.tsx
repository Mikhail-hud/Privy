import { FC, MouseEvent } from "react";
import { enqueueSnackbar } from "notistack";
import { QueryError } from "@app/core/interfaces";
import { UserFollowButton } from "@app/core/components";
import { GENERIC_ERROR_MESSAGE } from "@app/core/constants/general.ts";
import { useFollowUserMutation, useUnFollowUserMutation } from "@app/core/services";

interface UserProfileActionsProps {
    isFollowed: boolean;
    userName: string;
}

export const UserProfileActions: FC<UserProfileActionsProps> = ({ isFollowed, userName }) => {
    const [follow, { isLoading: isFollowLoading }] = useFollowUserMutation();
    const [unFollow, { isLoading: isUnFollowLoading }] = useUnFollowUserMutation();

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

    const handleFollowClick = (event: MouseEvent<HTMLButtonElement>): void => {
        event.stopPropagation();
        event.preventDefault();

        if (isFollowed) {
            handleUnfollow(userName);
        } else {
            handleFollow(userName);
        }
    };

    return (
        <UserFollowButton
            isFollowed={isFollowed}
            onClick={handleFollowClick}
            loading={isFollowLoading || isUnFollowLoading}
        />
    );
};
