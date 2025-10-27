import Box from "@mui/material/Box";
import { Theme } from "@mui/material";
import Badge from "@mui/material/Badge";
import { User } from "@app/core/services";
import { FC, memo, MouseEvent } from "react";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import { Link as RouterLink } from "react-router-dom";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { PublicIcon, PrivateIcon } from "@app/core/assets/icons";
import { Avatar, UserFollowButton, UserStats } from "@app/core/components";
import { USER_HANDLE_PREFIX } from "@app/core/constants/pathConstants.ts";

const avatarBadgeSx = (theme: Theme) => ({
    borderRadius: "50%",
    background: (theme.vars || theme).palette.background.paper,
    border: `1px solid ${(theme.vars || theme).palette.background.paper}`,
});

interface UserListItemProps {
    user: User;
    onFollow: (id: number, userName: string) => void;
    onUnfollow: (id: number, userName: string) => void;
}

export const UserListItemComponent: FC<UserListItemProps> = ({ user, onFollow, onUnfollow }) => {
    const isProfileIncognito: boolean = user.isProfileIncognito;
    const src: string | undefined = isProfileIncognito ? user?.privatePhoto?.signedUrl : user?.publicPhoto?.signedUrl;
    const alt: string = isProfileIncognito ? `avata_${user?.privatePhoto?.id}` : `avata_${user?.publicPhoto?.id}`;

    const handleFollowClick = (event: MouseEvent<HTMLButtonElement>): void => {
        event.stopPropagation();
        event.preventDefault();

        if (user.isFollowedByCurrentUser) {
            onUnfollow(user.id, user.userName);
        } else {
            onFollow(user.id, user.userName);
        }
    };

    return (
        <>
            <ListItem
                alignItems="flex-start"
                component={RouterLink}
                to={`/${USER_HANDLE_PREFIX}${user.userName}`}
                sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": {
                        backgroundColor: "action.hover",
                    },
                }}
            >
                <ListItemAvatar>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        badgeContent={
                            isProfileIncognito ? (
                                <PrivateIcon color="info" fontSize="small" sx={avatarBadgeSx} />
                            ) : (
                                <PublicIcon color="info" fontSize="small" sx={avatarBadgeSx} />
                            )
                        }
                    >
                        <Avatar userName={user.userName} alt={alt} src={src} />
                    </Badge>
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Box
                            sx={{
                                gap: 1,
                                mb: 1,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                                    @{user.userName}
                                </Typography>
                                <Typography color="text.secondary">{user?.fullName}</Typography>
                            </Box>
                            <UserFollowButton isFollowed={user.isFollowedByCurrentUser} onClick={handleFollowClick} />
                        </Box>
                    }
                    slotProps={{ secondary: { component: "div" } }}
                    secondary={
                        <>
                            <Typography variant="body1" color="textPrimary" sx={{ whiteSpace: "pre-wrap" }}>
                                {user.biography}
                            </Typography>
                            <UserStats followersCount={user.followersCount} followingCount={user.followingCount} />
                        </>
                    }
                />
            </ListItem>
            <Divider variant="inset" component="li" />
        </>
    );
};

export const UserListItem = memo(UserListItemComponent);
