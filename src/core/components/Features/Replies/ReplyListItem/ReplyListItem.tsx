import { FC, memo, MouseEvent } from "react";
import { PrivateIcon } from "@app/core/assets/icons";
import { Reply, Thread, ThreadMedia } from "@app/core/services";
import { getRelativeTime } from "@app/core/utils/dateUtils.ts";
import { stopEventPropagation } from "@app/core/utils/general.ts";
// import { NavigateFunction, useNavigate } from "react-router-dom";
// import { USER_HANDLE_PREFIX } from "@app/core/constants/pathConstants.ts";
import { getAuthorAvatarSrc, getAuthorDisplayName } from "@app/core/utils/authorUtils.ts";
import { Box, ListItem, Typography, Divider, ListItemText, ListItemAvatar } from "@mui/material";
import {
    Avatar,
    ReadMore,
    ReplyListActions,
    ReplyListMoreMenu,
    ThreadMediaGallery,
    UserAvatarBadge,
    UserHoverCard,
} from "@app/core/components";
import Chip from "@mui/material/Chip";
import { AuthorLikeAvatarBadge } from "@app/core/components/Features/Replies/ReplyListItem/components";

interface ReplyListItemProps {
    reply: Reply;
    thread: Thread;
    isLast: boolean;
    handleOpenThreadMediaBackdrop: (media: ThreadMedia) => void;
    handleOpenThreadMediaGalleryBackdrop: (media: ThreadMedia[], index: number) => void;
}

const ReplyListItemComponent: FC<ReplyListItemProps> = ({
    reply,
    isLast,
    thread,
    handleOpenThreadMediaBackdrop,
    handleOpenThreadMediaGalleryBackdrop,
}) => {
    // const navigate: NavigateFunction = useNavigate();
    const { author, isIncognito, isOwnedByCurrentUser, isLikedByCurrentUser, likeCount, childCount, media } = reply;

    const showMediaGallery: boolean = Array.isArray(media) && media.length > 0;
    const titleUserName: string = getAuthorDisplayName(reply);
    const src: string | undefined = getAuthorAvatarSrc(reply);
    const authorAvatarSrc: string | undefined = getAuthorAvatarSrc(thread);
    const isAuthorLinkDisabled: boolean = isIncognito && !isOwnedByCurrentUser;

    const handleNavigateToProfilePage = (e: MouseEvent<HTMLSpanElement>): void => {
        if (isAuthorLinkDisabled) {
            return;
        }
        stopEventPropagation(e);
        // TODO: Implement navigation to reply item page
        // navigate(`/${USER_HANDLE_PREFIX}${author?.userName}`);
    };

    return (
        <>
            <ListItem
                alignItems="flex-start"
                sx={{
                    "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "none",
                    },
                }}
            >
                <ListItemAvatar>
                    {isIncognito && !isOwnedByCurrentUser ? (
                        <PrivateIcon color="info" sx={{ width: 40, height: 40 }} />
                    ) : (
                        <UserAvatarBadge
                            isProfileIncognito={!!author?.isProfileIncognito}
                            onClick={handleNavigateToProfilePage}
                        >
                            <Avatar alt={src} src={src} sx={{ width: 40, height: 40 }} userName={author?.userName} />
                        </UserAvatarBadge>
                    )}
                </ListItemAvatar>

                <ListItemText
                    primary={
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box
                                sx={{
                                    gap: 1,
                                    display: "flex",
                                    textAlign: "center",
                                    alignItems: "center",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                }}
                            >
                                <UserHoverCard
                                    src={src}
                                    fullName={author?.fullName}
                                    userName={author?.userName}
                                    biography={author?.biography}
                                    followingCount={author?.followingCount}
                                    followersCount={author?.followersCount}
                                    disabled={isAuthorLinkDisabled}
                                    userProfileActionsShown={!isOwnedByCurrentUser}
                                    isProfileIncognito={author?.isProfileIncognito}
                                    isFollowedByCurrentUser={!!author?.isFollowedByCurrentUser}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        color="primary"
                                        sx={{
                                            "&:hover": {
                                                textDecoration: isAuthorLinkDisabled ? "none" : "underline",
                                            },
                                        }}
                                    >
                                        {titleUserName}
                                    </Typography>
                                </UserHoverCard>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {getRelativeTime(reply.createdAt)}
                                </Typography>
                                {reply?.isAuthorReply && <Chip label="Author" size="small" color="primary" />}
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "nowrap",
                                }}
                            >
                                {reply?.isLikedByAuthor && (
                                    <AuthorLikeAvatarBadge>
                                        {thread?.isIncognito && !thread?.isOwnedByCurrentUser ? (
                                            <PrivateIcon color="info" sx={{ width: 25, height: 25 }} />
                                        ) : (
                                            <Avatar
                                                alt={authorAvatarSrc}
                                                src={authorAvatarSrc}
                                                sx={{ width: 25, height: 25 }}
                                            />
                                        )}
                                    </AuthorLikeAvatarBadge>
                                )}
                                <ReplyListMoreMenu reply={reply} />
                            </Box>
                        </Box>
                    }
                    slotProps={{ secondary: { component: "div" } }}
                    secondary={
                        <Box sx={{ mt: 0.5 }}>
                            <ReadMore text={reply.content} />
                            {showMediaGallery && (
                                <ThreadMediaGallery
                                    threadMedia={media}
                                    handleOpenThreadMediaBackdrop={handleOpenThreadMediaBackdrop}
                                    handleOpenThreadMediaGalleryBackdrop={handleOpenThreadMediaGalleryBackdrop}
                                />
                            )}
                            <ReplyListActions
                                id={reply.id}
                                likeCount={likeCount}
                                childCount={childCount}
                                isLikedByCurrentUser={isLikedByCurrentUser}
                            />
                        </Box>
                    }
                />
            </ListItem>
            {!isLast && <Divider variant="inset" component="li" />}
        </>
    );
};

export const ReplyListItem = memo(ReplyListItemComponent);
