import { FC, memo } from "react";
import Box from "@mui/material/Box";
import { Theme } from "@mui/material";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import { User } from "@app/core/services";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import { Avatar, UserStats } from "@app/core/components";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { PublicIcon, PrivateIcon } from "@app/core/assets/icons";

const avatarBadgeSx = (theme: Theme) => ({
    borderRadius: "50%",
    background: (theme.vars || theme).palette.background.paper,
    border: `1px solid ${(theme.vars || theme).palette.background.paper}`,
});

interface UserListItemProps {
    user: User;
    onFollow: (id: number) => void;
    onUnfollow: (id: number) => void;
}

export const UserListItemComponent: FC<UserListItemProps> = ({ user, onFollow, onUnfollow }) => {
    const handleFollowClick = (): void => {
        if (user.isFollowedByCurrentUser) {
            onUnfollow(user.id);
        } else {
            onFollow(user.id);
        }
    };

    return (
        <>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        badgeContent={
                            user.isProfileIncognito ? (
                                <PrivateIcon color="info" fontSize="small" sx={avatarBadgeSx} />
                            ) : (
                                <PublicIcon color="info" fontSize="small" sx={avatarBadgeSx} />
                            )
                        }
                    >
                        <Avatar
                            userName={user.userName}
                            alt={`avata_${user?.publicPhoto?.id || user?.privatePhoto?.id}`}
                            src={user?.publicPhoto?.signedUrl || user?.privatePhoto?.signedUrl}
                        />
                    </Badge>
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                                @{user.userName}
                            </Typography>
                            <Typography color="text.secondary">{user?.fullName}</Typography>
                        </Box>
                    }
                    slotProps={{ secondary: { component: "div" } }}
                    secondary={
                        <>
                            <Typography variant="body2" color="textPrimary" sx={{ whiteSpace: "pre-wrap", mt: 1 }}>
                                {user.biography}
                            </Typography>
                            <UserStats followersCount={user.followersCount} followingCount={user.followingCount} />
                        </>
                    }
                />
                <Button
                    onClick={handleFollowClick}
                    color="primary"
                    variant={user.isFollowedByCurrentUser ? "outlined" : "contained"}
                >
                    {user.isFollowedByCurrentUser ? "Subscribed" : "Subscribe"}
                </Button>
            </ListItem>
            <Divider variant="inset" component="li" />
        </>
    );
};

export const UserListItem = memo(UserListItemComponent);
