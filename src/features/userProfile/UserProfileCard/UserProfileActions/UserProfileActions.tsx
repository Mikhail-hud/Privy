import { FC, MouseEvent } from "react";
import { enqueueSnackbar } from "notistack";
import { QueryError } from "@app/core/interfaces";
import { UserFollowButton } from "@app/core/components";
import { GENERIC_ERROR_MESSAGE } from "@app/core/constants/general.ts";
import { useFollowUserMutation, useUnFollowUserMutation } from "@app/core/services";

interface UserProfileActionsProps {
    isFollowed: boolean;
    userId: number;
}

export const UserProfileActions: FC<UserProfileActionsProps> = ({ isFollowed, userId }) => {
    const [follow, { isLoading: isFollowLoading }] = useFollowUserMutation();
    const [unFollow, { isLoading: isUnFollowLoading }] = useUnFollowUserMutation();

    const handleFollow = async (id: number): Promise<void> => {
        try {
            await follow({ id }).unwrap();
        } catch (error) {
            const errorMessage: string = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    const handleUnfollow = async (id: number): Promise<void> => {
        try {
            await unFollow({ id }).unwrap();
        } catch (error) {
            const errorMessage: string = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    const handleFollowClick = (event: MouseEvent<HTMLButtonElement>): void => {
        event.stopPropagation();
        event.preventDefault();

        if (isFollowed) {
            handleUnfollow(userId);
        } else {
            handleFollow(userId);
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
