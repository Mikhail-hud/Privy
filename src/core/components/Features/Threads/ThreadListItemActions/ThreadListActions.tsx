import { FC, memo } from "react";
import Box from "@mui/material/Box";
import { enqueueSnackbar } from "notistack";
import { Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import IconButton from "@mui/material/IconButton";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { stopEventPropagation } from "@app/core/utils/general.ts";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { ApiError, useLikeThreadMutation, useUnlikeThreadMutation } from "@app/core/services";

interface ThreadListActionsActionsProps {
    isOwnedByCurrentUser: boolean;
    isLikedByCurrentUser: boolean;
    id: string;
    likeCount: number;
    replyCount: number;
}
const ThreadListActionsComponent: FC<ThreadListActionsActionsProps> = ({
    id,
    isLikedByCurrentUser,
    likeCount,
    replyCount,
}) => {
    const { mutateAsync: likeThread, isPending: isLiking } = useLikeThreadMutation();
    const { mutateAsync: unLikeThread, isPending: isUnliking } = useUnlikeThreadMutation();

    const handleLike = async (): Promise<void> => {
        try {
            if (isLikedByCurrentUser) {
                await unLikeThread(id);
                return;
            }
            await likeThread(id);
        } catch (error) {
            const errorMessage: string = (error as ApiError)?.message;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };
    const handleReply = () => {
        // TODO: Implement reply logic
        console.log("Reply clicked");
    };
    const handleRepost = () => {
        // TODO: Implement repost logic
        console.log("Repost clicked");
    };
    const handleSend = () => {
        // TODO: Implement send logic
        console.log("Send clicked");
    };

    return (
        <Box sx={{ display: "flex", gap: 1, mt: 1, ml: -1 }} onClick={stopEventPropagation}>
            <IconButton size="small" onClick={handleLike} loading={isLiking || isUnliking}>
                {isLikedByCurrentUser ? (
                    <FavoriteIcon fontSize="small" color="info" />
                ) : (
                    <FavoriteBorderIcon fontSize="small" color="action" />
                )}
                {likeCount > 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                        {likeCount}
                    </Typography>
                )}
            </IconButton>
            <IconButton size="small" onClick={handleReply}>
                <ChatBubbleOutlineIcon fontSize="small" color="action" />
                {replyCount > 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                        {replyCount}
                    </Typography>
                )}
            </IconButton>
            <IconButton size="small" onClick={handleRepost}>
                <RepeatIcon fontSize="small" color="action" />
            </IconButton>
            <IconButton size="small" onClick={handleSend}>
                <SendIcon fontSize="small" color="action" />
            </IconButton>
        </Box>
    );
};

export const ThreadListActions = memo(ThreadListActionsComponent);
