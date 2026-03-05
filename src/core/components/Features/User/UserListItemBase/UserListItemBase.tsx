import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import { FC, ReactNode, MouseEvent } from "react";
import ListItemText from "@mui/material/ListItemText";
import { Link as RouterLink } from "react-router-dom";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { stopEventPropagation } from "@app/core/utils/general.ts";
import { UserAvatarBadge, Avatar, UserHoverCard } from "@app/core/components";
import { USER_HANDLE_PREFIX } from "@app/core/constants/pathConstants.ts";

interface UserListItemBaseProps {
    isLast: boolean;
    userName: string;
    action?: ReactNode;
    avatarUrl: string | undefined;
    avatarAlt: string;
    fullName?: string | null | undefined;
    isProfileIncognito: boolean;
    secondaryContent?: ReactNode;
    isFollowedByCurrentUser?: boolean;
    biography?: string;
    followersCount?: number;
    followingCount?: number;
    isUserHoverCardShown?: boolean;
    userProfileActionsShown?: boolean;
    onListItemClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

const UserListItemBaseComponent: FC<UserListItemBaseProps> = ({
    userName,
    isLast,
    fullName,
    isProfileIncognito,
    avatarAlt,
    avatarUrl,
    secondaryContent,
    onListItemClick,
    isFollowedByCurrentUser,
    userProfileActionsShown,
    followersCount,
    followingCount,
    biography,
    action,
    isUserHoverCardShown = false,
}) => {
    return (
        <>
            <ListItem
                component={RouterLink}
                alignItems="flex-start"
                onClick={onListItemClick}
                to={`/${USER_HANDLE_PREFIX}${userName}`}
            >
                <ListItemAvatar>
                    <UserAvatarBadge isProfileIncognito={isProfileIncognito}>
                        <Avatar userName={userName} alt={avatarAlt} src={avatarUrl} />
                    </UserAvatarBadge>
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Box
                            sx={{
                                mb: 1,
                                display: "flex",
                                flexWrap: "nowrap",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "self-start",
                                    flexDirection: "column",
                                    overflow: "hidden",
                                    mr: { xxs: 0, sm: 1 },
                                }}
                            >
                                <UserHoverCard
                                    userName={userName}
                                    fullName={fullName}
                                    src={avatarUrl}
                                    biography={biography}
                                    followingCount={followingCount}
                                    followersCount={followersCount}
                                    disabled={!isUserHoverCardShown}
                                    isFollowedByCurrentUser={isFollowedByCurrentUser}
                                    isProfileIncognito={isProfileIncognito}
                                    userProfileActionsShown={!!userProfileActionsShown}
                                    sx={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        maxWidth: "100%",
                                    }}
                                >
                                    <Typography
                                        textOverflow="ellipsis"
                                        variant="subtitle1"
                                        color="primary"
                                        sx={{
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis",
                                            maxWidth: "100%",
                                            "&:hover": { textDecoration: "underline" },
                                        }}
                                    >
                                        @{userName}
                                    </Typography>
                                </UserHoverCard>
                                {fullName && (
                                    <Typography
                                        textOverflow="ellipsis"
                                        sx={{
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis",
                                            maxWidth: "100%",
                                        }}
                                        color="text.secondary"
                                    >
                                        {fullName}
                                    </Typography>
                                )}
                            </Box>
                            {action && (
                                <Box
                                    onClick={stopEventPropagation}
                                    onMouseDown={stopEventPropagation}
                                    onTouchStart={stopEventPropagation}
                                >
                                    {action}
                                </Box>
                            )}
                        </Box>
                    }
                    slotProps={{ secondary: { component: "div" } }}
                    secondary={secondaryContent}
                />
            </ListItem>
            {!isLast && <Divider variant="inset" component="li" />}
        </>
    );
};

export const UserListItemBase = memo(UserListItemBaseComponent);
