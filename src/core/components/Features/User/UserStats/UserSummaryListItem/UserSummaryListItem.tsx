import { FC, memo } from "react";
import { UserSummary } from "@app/core/services";
import { UserListItemBase } from "@app/core/components";

interface UserSummaryListItemProps {
    isLast: boolean;
    user: UserSummary;
    isOwnerUserName?: string;
    onFollow: (userName: string) => void;
    onUnfollow: (userName: string) => void;
}

export const UserSummaryListItemComponent: FC<UserSummaryListItemProps> = ({
    user,
    onFollow,
    onUnfollow,
    isLast,
    isOwnerUserName,
}) => {
    const isProfileIncognito: boolean = user.isProfileIncognito;
    const src: string | undefined = isProfileIncognito ? user?.privatePhoto?.signedUrl : user?.publicPhoto?.signedUrl;
    const alt: string = isProfileIncognito ? `avata_${user?.privatePhoto?.id}` : `avata_${user?.publicPhoto?.id}`;

    return (
        <UserListItemBase
            avatarUrl={src}
            avatarAlt={alt}
            isLast={isLast}
            onFollow={onFollow}
            onUnfollow={onUnfollow}
            userName={user.userName}
            fullName={user.fullName}
            isOwnerUserName={isOwnerUserName}
            isFollowed={user.isFollowedByCurrentUser}
            isProfileIncognito={user.isProfileIncognito}
        />
    );
};

export const UserSummaryListItem = memo(UserSummaryListItemComponent);
