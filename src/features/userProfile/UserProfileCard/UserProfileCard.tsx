import { FC } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { User } from "@app/core/services";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { InterestList } from "@app/core/components/Ui/InterestList";
import { ContentCardContainer, LinksList, UserStats } from "@app/core/components";
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
                            {user?.fullName && (
                                <Typography variant="subtitle1" color="primary">
                                    {user?.fullName}
                                </Typography>
                            )}
                            <Typography variant="body2" color="textSecondary">
                                @{user.userName}
                            </Typography>
                        </Box>
                        <UserProfileActions
                            userId={user.id}
                            userName={user.userName}
                            isFollowed={user.isFollowedByCurrentUser}
                        />
                    </Box>
                }
                subheader={
                    <>
                        <LinksList links={user.links} />
                        <InterestList interest={user.interests} />
                    </>
                }
            />
            <CardActions disableSpacing>
                <UserStats followersCount={user.followersCount} followingCount={user.followingCount} />
            </CardActions>
            {user?.biography && (
                <>
                    <Divider textAlign="left">
                        <Typography variant="subtitle1" color="primary">
                            Biography
                        </Typography>
                    </Divider>
                    <CardContent>
                        <Typography variant="body1" color="textPrimary" sx={{ whiteSpace: "pre-wrap" }}>
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
