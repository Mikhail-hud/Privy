import { FC, memo, MouseEvent } from "react";
import { UserSummary } from "@app/core/services";
import { UserFollowButton, UserListItemBase } from "@app/core/components";

interface UserSummaryListItemProps {
    isLast: boolean;
    user: UserSummary;
    isOwnerUserName?: string;
    onListItemClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export const UserSummaryListItemComponent: FC<UserSummaryListItemProps> = ({
    user,
    isLast,
    isOwnerUserName,
    onListItemClick,
}) => {
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
            onListItemClick={onListItemClick}
            isOwnerUserName={isOwnerUserName}
            isProfileIncognito={user.isProfileIncognito}
            action={
                isOwnerUserName !== user.userName && (
                    <UserFollowButton isFollowed={user.isFollowedByCurrentUser} userName={user.userName} />
                )
            }
        />
    );
};

export const UserSummaryListItem = memo(UserSummaryListItemComponent);
