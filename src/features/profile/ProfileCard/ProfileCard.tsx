import { FC } from "react";
import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
import { Profile, Tag, UserLink } from "@app/core/services";
import { ProfileTabs } from "@app/features/profile/ProfileCard/ProfileTabs";
import { EditProfileAction } from "@app/features/profile/ProfileCard/EditProfileAction";
import { ProfileAvatar, ProfileCardContainer, ProfileReveals, UserStats } from "@app/core/components";

interface ProfileCardProps {
    profile: Profile;
}

export const ProfileCard: FC<ProfileCardProps> = memo(({ profile }) => {
    const { userName, followersCount, followingCount, links, fullName, interests, biography } = profile;
    const userlinks = useMemo((): UserLink[] => links, [links]);
    const userInterests = useMemo((): Tag[] => interests, [interests]);
    return (
        <ProfileCardContainer
            avatar={<ProfileAvatar profile={profile} />}
            titleAction={<EditProfileAction profile={profile} />}
            cardAction={
                <Box
                    sx={{
                        gap: 1,
                        display: "flex",
                        width: "100%",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                    }}
                >
                    <UserStats followersCount={followersCount} followingCount={followingCount} userName={userName} />
                    <ProfileReveals />
                </Box>
            }
            links={userlinks}
            fullName={fullName}
            userName={userName}
            interests={userInterests}
            biography={biography}
        >
            <>
                <ProfileTabs />
                <Outlet />
            </>
        </ProfileCardContainer>
    );
});
