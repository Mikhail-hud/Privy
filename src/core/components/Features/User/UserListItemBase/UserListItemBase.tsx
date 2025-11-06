import Box from "@mui/material/Box";
import { FC, ReactNode } from "react";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import { Link as RouterLink } from "react-router-dom";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { USER_HANDLE_PREFIX } from "@app/core/constants/pathConstants.ts";
import { UserAvatarBadge, UserFollowButton, Avatar } from "@app/core/components";

interface UserListItemBaseProps {
    isLast: boolean;
    userName: string;
    avatarUrl: string | undefined;
    avatarAlt: string;
    isFollowed: boolean;
    fullName?: string | null;
    isProfileIncognito: boolean;
    secondaryContent?: ReactNode;
    isOwnerUserName?: string;
}

const UserListItemBaseComponent: FC<UserListItemBaseProps> = ({
    userName,
    isLast,
    fullName,
    isFollowed,
    isProfileIncognito,
    avatarAlt,
    avatarUrl,
    secondaryContent,
    isOwnerUserName,
}) => {
    return (
        <>
            <ListItem alignItems="flex-start" component={RouterLink} to={`/${USER_HANDLE_PREFIX}${userName}`}>
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
                                    mr: { xs: 0, sm: 1 },
                                }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    color="primary"
                                    sx={{
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                        textOverflow: "ellipsis",
                                        maxWidth: "100%",
                                    }}
                                >
                                    @{userName}
                                </Typography>
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
                            {isOwnerUserName !== userName && (
                                <UserFollowButton isFollowed={isFollowed} userName={userName} />
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
