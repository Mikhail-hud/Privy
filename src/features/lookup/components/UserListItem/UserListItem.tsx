import { FC, memo } from "react";
import { User } from "@app/core/services";
import Typography from "@mui/material/Typography";
import { UserListItemBase, UserStats } from "@app/core/components";

interface UserListItemProps {
    user: User;
    isLast: boolean;
}

const UserListItemComponent: FC<UserListItemProps> = ({ user, isLast }) => {
    const isProfileIncognito: boolean = user.isProfileIncognito;
    const src: string | undefined = isProfileIncognito ? user?.privatePhoto?.signedUrl : user?.publicPhoto?.signedUrl;
    const alt: string = isProfileIncognito ? `avata_${user?.privatePhoto?.id}` : `avata_${user?.publicPhoto?.id}`;

    return (
        <UserListItemBase
            avatarUrl={src}
            avatarAlt={alt}
            isLast={isLast}
            userName={user.userName}
            fullName={user.fullName}
            isFollowed={user.isFollowedByCurrentUser}
            isProfileIncognito={user.isProfileIncognito}
            secondaryContent={
                <>
                    {user?.biography && (
                        <Typography
                            variant="body1"
                            color="textPrimary"
                            sx={{
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
