import { FC } from "react";
import Card from "@mui/material/Card";
import { Outlet } from "react-router-dom";
import Divider from "@mui/material/Divider";
// import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
// import CardActions from "@mui/material/CardActions";
// import FavoriteIcon from "@mui/icons-material/Favorite";
import { ProfileAvatar } from "@app/core/components";
import { ProfileTabs } from "@app/features/profile/ProfileCard/ProfileTabs";
import { EditProfileAction } from "@app/features/profile/ProfileCard/EditProfileAction";
import { UserContext } from "@app/features";
import { useAuth } from "@app/core/hooks";

export const ProfileCard: FC = () => {
    const { profile } = useAuth();
    const context = useOutletContext<UserContext>();
    return (
        <Card variant="outlined" sx={{ maxWidth: 800, margin: "auto", height: "100%" }}>
            <CardHeader
                avatar={<ProfileAvatar profile={profile} isOwner />}
                subheader={profile.userName}
                action={<EditProfileAction />}
                title={profile.fullName}
            />
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
            {/*<CardActions disableSpacing>*/}
            {/*    <IconButton color="primary">*/}
            {/*        <FavoriteIcon />*/}
            {/*    </IconButton>*/}
            {/*</CardActions>*/}
            <CardContent sx={{ pt: 0 }}>
                <ProfileTabs />
                <Outlet context={context} />
            </CardContent>
        </Card>
    );
};
