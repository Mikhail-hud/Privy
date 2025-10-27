import { FC } from "react";
import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
import Divider from "@mui/material/Divider";
import { Profile } from "@app/core/services";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { InterestList } from "@app/core/components/Ui/InterestList";
import { ProfileTabs } from "@app/features/profile/ProfileCard/ProfileTabs";
import { EditProfileAction } from "@app/features/profile/ProfileCard/EditProfileAction";
import { ContentCardContainer, LinksList, ProfileAvatar, UserStats } from "@app/core/components";

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
                avatar={<ProfileAvatar profile={profile} />}
                title={
                    <Box
                        sx={{
                            gap: 1,
                            mb: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "start",
                            justifyContent: "space-between",
                        }}
                    >
                        <Box>
                            <Typography variant="subtitle1" color="primary">
                                {profile.fullName}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                @{profile.userName}
                            </Typography>
                        </Box>
                        <EditProfileAction profile={profile} />
                    </Box>
                }
                subheader={
                    <>
                        <LinksList links={profile.links} />
                        <InterestList interest={profile.interests} />
                    </>
                }
            />
            <CardActions disableSpacing>
                <UserStats followersCount={profile.followersCount} followingCount={profile.followingCount} />
            </CardActions>
            {profile.biography && (
                <>
                    <Divider textAlign="left">
                        <Typography variant="subtitle1" color="primary">
                            Biography
                        </Typography>
                    </Divider>
                    <CardContent>
                        <Typography variant="body1" color="textPrimary" sx={{ whiteSpace: "pre-wrap" }}>
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
