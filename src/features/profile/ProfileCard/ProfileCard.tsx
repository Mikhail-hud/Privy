import { FC } from "react";
import { Outlet } from "react-router-dom";
import { Profile } from "@app/core/services";
import { ProfileTabs } from "@app/features/profile/ProfileCard/ProfileTabs";
import { ProfileAvatar, ProfileCardContainer, UserStats } from "@app/core/components";
import { EditProfileAction } from "@app/features/profile/ProfileCard/EditProfileAction";

interface ProfileCardProps {
    profile: Profile;
}

export const ProfileCard: FC<ProfileCardProps> = memo(({ profile }) => {
    const { userName, followersCount, followingCount, links, fullName, interests } = profile;
    const userlinks = useMemo(() => links, [links]);
    const userInterests = useMemo(() => interests, [interests]);
    return (
        <ProfileCardContainer
            avatar={<ProfileAvatar profile={profile} />}
            titleAction={<EditProfileAction profile={profile} />}
            cardAction={
                <UserStats followersCount={followersCount} followingCount={followingCount} userName={userName} />
            }
            links={userlinks}
            fullName={fullName}
            userName={userName}
            interests={userInterests}
        >
            <>
                <ProfileTabs />
                <Outlet />
            </>
        </ProfileCardContainer>
    );
});
