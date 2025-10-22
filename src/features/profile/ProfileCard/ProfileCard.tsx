import { FC } from "react";
import { Outlet } from "react-router-dom";
import Divider from "@mui/material/Divider";
import { Profile } from "@app/core/services";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
// import CardActions from "@mui/material/CardActions";
import { ContentCardContainer, LinksList, ProfileAvatar, UserStats } from "@app/core/components";
import { ProfileTabs } from "@app/features/profile/ProfileCard/ProfileTabs";
import { EditProfileAction } from "@app/features/profile/ProfileCard/EditProfileAction";
interface ProfileCardProps {
    profile: Profile;
}

export const ProfileCard: FC<ProfileCardProps> = memo(({ profile }) => {
    return (
        <ContentCardContainer>
            <CardHeader
                sx={{
                    "& .MuiCardHeader-content": {
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        // alignSelf: "self-start",
                        alignSelf: "stretch",
                        justifyContent: "space-between",
                    },
                }}
                avatar={<ProfileAvatar profile={profile} isOwner />}
                action={<EditProfileAction profile={profile} />}
                title={
                    <>
                        <Typography variant="subtitle1" color="primary">
                            {profile.fullName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            @{profile.userName}
                        </Typography>
                    </>
                }
                subheader={
                    <>
                        <UserStats followersCount={profile.followersCount} followingCount={profile.followingCount} />
                        <LinksList links={profile.links} />
                    </>
                }
            />
            {/*<CardActions disableSpacing>*/}
            {/*    <LinksList links={profile.links} />*/}
            {/*</CardActions>*/}
            {profile.biography && (
                <>
                    <Divider textAlign="left">
                        <Typography variant="subtitle1" color="textSecondary">
                            Biography
                        </Typography>
                    </Divider>
                    <CardContent>
                        <Typography variant="body1" color="textSecondary" sx={{ whiteSpace: "pre-wrap" }}>
                            {profile.biography}
                        </Typography>
                    </CardContent>
                </>
            )}
            <CardContent sx={{ pt: 0 }}>
                <ProfileTabs />
                <Outlet />
            </CardContent>
        </ContentCardContainer>
    );
});
