import { FC, memo } from "react";
import { Thread } from "@app/core/services";
import { PrivateIcon } from "@app/core/assets/icons";
import { Link as RouterLink } from "react-router-dom";
import { getRelativeTime } from "@app/core/utils/dateUtils.ts";
import { Avatar, ReadMore, UserAvatarBadge } from "@app/core/components";
import { ThreadListActions, ThreadListMoreMenu, ThreadMediaGallery } from "@app/features/talkSpace/components";
import { Box, ListItem, Typography, Divider, ListItemText, ListItemAvatar } from "@mui/material";

interface ThreadListItemProps {
    thread: Thread;
    isLast: boolean;
}

const getAuthorDisplayName = (thread: Thread): string => {
    if (thread.isOwnedByCurrentUser && thread.isIncognito) {
        return "You (Incognito)";
    }
    if (thread.isOwnedByCurrentUser) {
        return `@${thread?.author?.userName} (You)`;
    }
    if (thread.isIncognito) {
        return "Incognito User";
    }
    return `@${thread?.author?.userName}`;
};

const getAuthorAvatarSrc = (thread: Thread): string | undefined => {
    if (thread.isOwnedByCurrentUser) {
        return thread?.author?.publicPhoto?.src;
    }
    if (thread.isIncognito) {
        return "undefined";
    }
    return thread?.author?.publicPhoto?.src || thread?.author?.privatePhoto?.src;
};

const ThreadListItemComponent: FC<ThreadListItemProps> = ({ thread, isLast }) => {
    const { author, isIncognito, isOwnedByCurrentUser, isLikedByCurrentUser, likeCount, replyCount, media } = thread;

    const showMedia: boolean = Array.isArray(media) && media.length > 0;
    const titleUserName: string = getAuthorDisplayName(thread);
    const src: string | undefined = getAuthorAvatarSrc(thread);

    return (
        <>
            <ListItem
                alignItems="flex-start"
                // TODO: Implement navigation to thread detail
                component={RouterLink}
                to={`/thread/${thread.id}`}
            >
                <ListItemAvatar>
                    {isIncognito && !isOwnedByCurrentUser ? (
                        <PrivateIcon color="info" sx={{ width: 40, height: 40 }} />
                    ) : (
                        <UserAvatarBadge isProfileIncognito={!!author?.isProfileIncognito}>
                            <Avatar
                                alt={src}
                                src={src}
                                sx={{ width: 40, height: 40 }}
                                userName={thread?.author?.userName}
                            />
                        </UserAvatarBadge>
                    )}
                </ListItemAvatar>

                <ListItemText
                    primary={
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box sx={{ display: "flex", gap: 1, textAlign: "center", alignItems: "center" }}>
                                <Typography variant="subtitle1" color="primary">
                                    {titleUserName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {getRelativeTime(thread.createdAt)}
                                </Typography>
                            </Box>
                            <ThreadListMoreMenu thread={thread} />
                        </Box>
                    }
                    slotProps={{ secondary: { component: "div" } }}
                    secondary={
                        <Box sx={{ mt: 0.5 }}>
                            <ReadMore text={thread.content} />
                            {showMedia && <ThreadMediaGallery threadMedia={thread.media} />}
                            <ThreadListActions
                                id={thread.id}
                                likeCount={likeCount}
                                replyCount={replyCount}
                                isLikedByCurrentUser={isLikedByCurrentUser}
                                isOwnedByCurrentUser={isOwnedByCurrentUser}
                            />
                        </Box>
                    }
                />
            </ListItem>
            {!isLast && <Divider variant="inset" component="li" />}
        </>
    );
};

export const ThreadListItem = memo(ThreadListItemComponent);
