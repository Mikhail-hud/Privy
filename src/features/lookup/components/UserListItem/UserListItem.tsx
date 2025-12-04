import { FC, memo } from "react";
import { User } from "@app/core/services";
import Typography from "@mui/material/Typography";
import { UserFollowButton, UserListItemBase, UserStats } from "@app/core/components";

interface UserListItemProps {
    user: User;
    isLast: boolean;
}

const UserListItemComponent: FC<UserListItemProps> = ({ user, isLast }) => {
    const src: string | undefined = user.canViewFullProfile ? user?.publicPhoto?.src : user?.privatePhoto?.src;
    const alt: string = user.canViewFullProfile
        ? `avatar_${user?.publicPhoto?.id}`
        : `avatar_${user?.privatePhoto?.id}`;

    return (
        <UserListItemBase
            avatarUrl={src}
            avatarAlt={alt}
            isLast={isLast}
            userName={user.userName}
            fullName={user.fullName}
            isProfileIncognito={user.isProfileIncognito}
            action={<UserFollowButton isFollowed={user.isFollowedByCurrentUser} userName={user.userName} />}
            secondaryContent={
                <>
                    {user?.biography && (
                        <Typography
                            variant="body1"
                            color="textPrimary"
                            sx={{
                                mb: 1,
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 3, // Limit to 3 lines
                                whiteSpace: "pre-wrap",
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {user.biography}
                        </Typography>
                    )}
                    <UserStats
                        userName={user.userName}
                        followersCount={user.followersCount}
                        followingCount={user.followingCount}
                    />
                </>
            }
        />
    );
};

export const UserListItem = memo(UserListItemComponent);
