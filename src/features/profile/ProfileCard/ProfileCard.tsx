import { FC } from "react";
import { Outlet } from "react-router-dom";
import { Profile } from "@app/core/services";
import { ProfileAvatar, ProfileCardContainer } from "@app/core/components";
import { ProfileTabs } from "@app/features/profile/ProfileCard/ProfileTabs";
import { EditProfileAction } from "@app/features/profile/ProfileCard/EditProfileAction";

interface ProfileCardProps {
    profile: Profile;
}

export const ProfileCard: FC<ProfileCardProps> = memo(({ profile }) => {
    return (
        <ProfileCardContainer
            avatar={<ProfileAvatar profile={profile} />}
            titleAction={<EditProfileAction profile={profile} />}
            {...profile}
        >
            <>
                <ProfileTabs />
                <Outlet />
            </>
        </ProfileCardContainer>
    );
});
