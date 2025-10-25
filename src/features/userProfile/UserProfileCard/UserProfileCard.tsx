import { FC } from "react";
import Divider from "@mui/material/Divider";
import { User } from "@app/core/services";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { ContentCardContainer, UserStats } from "@app/core/components";
import { UserProfileAvatar } from "@app/features/userProfile/UserProfileCard/UserProfileAvatar";
import { UserProfileActions } from "@app/features/userProfile/UserProfileCard/UserProfileActions";

interface ProfileCardProps {
    user: User;
}

export const UserProfileCard: FC<ProfileCardProps> = memo(({ user }) => {
    return (
        <ContentCardContainer>
            <CardHeader
                sx={{
                    "& .MuiCardHeader-content": {
                        gap: 0.5,
                        display: "flex",
                        alignSelf: "stretch",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    },
                }}
                avatar={<UserProfileAvatar user={user} />}
                action={<UserProfileActions userId={user.id} isFollowed={user.isFollowedByCurrentUser} />}
                title={
                    <>
                        {user?.fullName && (
                            <Typography variant="subtitle1" color="primary">
                                {user?.fullName}
                            </Typography>
                        )}
                        <Typography variant="body2" color="textSecondary">
                            @{user.userName}
                        </Typography>
                    </>
                }
                subheader={<UserStats followersCount={user.followersCount} followingCount={user.followingCount} />}
            />
            {/*<CardActions disableSpacing>*/}
            {/*    <LinksList links={profile.links} />*/}
            {/*</CardActions>*/}
            {user?.biography && (
                <>
                    <Divider textAlign="left">
                        <Typography variant="subtitle1" color="textSecondary">
                            Biography
                        </Typography>
                    </Divider>
                    <CardContent>
                        <Typography variant="body1" color="textSecondary" sx={{ whiteSpace: "pre-wrap" }}>
                            {user.biography}
                        </Typography>
                    </CardContent>
                </>
            )}
            {/*<CardContent sx={{ pt: 0 }}>*/}
            {/*    <ProfileTabs />*/}
            {/*    <Outlet />*/}
            {/*</CardContent>*/}
        </ContentCardContainer>
    );
});
