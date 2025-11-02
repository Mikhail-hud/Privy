import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import { FC, MouseEvent, ReactNode } from "react";
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
    onFollow: (userName: string) => void;
    onUnfollow: (userName: string) => void;
}

const UserListItemBaseComponent: FC<UserListItemBaseProps> = ({
    userName,
    onUnfollow,
    isLast,
    onFollow,
    fullName,
    isFollowed,
    isProfileIncognito,
    avatarAlt,
    avatarUrl,
    secondaryContent,
    isOwnerUserName,
}) => {
    const handleFollowClick = (event: MouseEvent<HTMLButtonElement>): void => {
        event.stopPropagation();
        event.preventDefault();

        if (isFollowed) {
            onUnfollow(userName);
        } else {
            onFollow(userName);
        }
    };

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
                                gap: 1,
                                mb: 1,
                                display: "flex",
                                flexWrap: "nowrap",
                                justifyContent: "space-between",
                                alignItems: { xs: "flex-start", sm: "center" },
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                                    @{userName}
                                </Typography>
                                {fullName && <Typography color="text.secondary">{fullName}</Typography>}
                            </Box>
                            {isOwnerUserName !== userName && (
                                <UserFollowButton isFollowed={isFollowed} onClick={handleFollowClick} />
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
