import { FC, memo } from "react";
import Box from "@mui/material/Box";
import { enqueueSnackbar } from "notistack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { stopEventPropagation } from "@app/core/utils/general.ts";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { ApiError, useLikeReplyMutation, useUnlikeReplyMutation } from "@app/core/services";

interface ReplyListActionsProps {
    id: string;
    likeCount: number;
    childCount: number;
    isLikedByCurrentUser: boolean;
}

const ReplyListActionsComponent: FC<ReplyListActionsProps> = ({ id, likeCount, childCount, isLikedByCurrentUser }) => {
    const { mutateAsync: likeReply, isPending: isLiking } = useLikeReplyMutation();
    const { mutateAsync: unLikeReply, isPending: isUnliking } = useUnlikeReplyMutation();

    const handleLike = async (): Promise<void> => {
        try {
            if (isLikedByCurrentUser) {
                await unLikeReply(id);
                return;
            }
            await likeReply(id);
        } catch (error) {
            const errorMessage: string = (error as ApiError)?.message;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
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
            {childCount > 0 && (
                <IconButton disabled size="small">
                    <ChatBubbleOutlineIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                        {childCount}
                    </Typography>
                </IconButton>
            )}
        </Box>
    );
};

export const ReplyListActions = memo(ReplyListActionsComponent);
