import { FC } from "react";
import Card from "@mui/material/Card";
import { Outlet } from "react-router-dom";
import Divider from "@mui/material/Divider";
// import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
// import CardActions from "@mui/material/CardActions";
import { useGetProfileQuery } from "@app/core/services";
// import FavoriteIcon from "@mui/icons-material/Favorite";
import { ProfileTabs } from "@app/features/profile/ProfileCard/ProfileTabs";
import { ProfileAvatar } from "@app/features/profile/ProfileCard/ProfileAvatar";
import { EditProfileAction } from "@app/features/profile/ProfileCard/EditProfileAction";

export const ProfileCard: FC = () => {
    const { data } = useGetProfileQuery();
    return (
        <Card variant="outlined" sx={{ maxWidth: 800, margin: "auto", mt: 1, mb: 1 }}>
            <CardHeader
                avatar={<ProfileAvatar />}
                subheader={data?.userName}
                action={<EditProfileAction />}
                title={data?.fullName ? data.fullName : undefined}
            />
            {data?.biography && (
                <>
                    <Divider textAlign="left">
                        <Typography variant="subtitle1" color="textSecondary">
                            Biography
                        </Typography>
                    </Divider>
                    <CardContent>
                        <Typography variant="body1" color="textSecondary" sx={{ whiteSpace: "pre-wrap" }}>
                            {data?.biography}
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
                <Outlet />
            </CardContent>
        </Card>
    );
};
