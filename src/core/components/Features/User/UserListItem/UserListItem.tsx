import { useAuth } from "@app/core/hooks";
import { UserSummary } from "@app/core/services";
import Typography from "@mui/material/Typography";
import { FC, memo, MouseEvent, ReactNode } from "react";
import { UserFollowButton, UserListItemBase, UserStats } from "@app/core/components";

interface UserListItemProps {
    user: UserSummary;
    isLast: boolean;
    detailed?: boolean;
    onListItemClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
    action?: ReactNode;
}

const UserListItemComponent: FC<UserListItemProps> = ({ user, isLast, onListItemClick, detailed }) => {
    const {
        profile: { id: profileId },
    } = useAuth();
    const src: string | undefined = user.canViewFullProfile ? user?.publicPhoto?.src : user?.privatePhoto?.src;
    const alt: string = user.canViewFullProfile
        ? `avatar_${user?.publicPhoto?.id}`
        : `avatar_${user?.privatePhoto?.id}`;

    const isOwnProfile: boolean = user.id === profileId;

    return (
        <UserListItemBase
            onListItemClick={onListItemClick}
            avatarUrl={src}
            avatarAlt={alt}
            isLast={isLast}
            userName={user?.userName}
            fullName={user?.fullName}
            isUserHoverCardShown
            userProfileActionsShown={!isOwnProfile}
            isFollowedByCurrentUser={user?.isFollowedByCurrentUser}
            biography={user?.biography}
            followersCount={user?.followersCount}
            followingCount={user?.followingCount}
            isProfileIncognito={user.isProfileIncognito}
            action={
                !isOwnProfile && <UserFollowButton isFollowed={user.isFollowedByCurrentUser} userName={user.userName} />
            }
            secondaryContent={
                detailed && (
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
                )
            }
        />
    );
};

export const UserListItem = memo(UserListItemComponent);
