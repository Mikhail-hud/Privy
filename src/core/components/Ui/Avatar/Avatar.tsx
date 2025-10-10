import React from "react";
import { User } from "@app/core/services";
import MUIAvatar, { AvatarProps } from "@mui/material/Avatar";
import Skeleton, { SkeletonProps } from "@mui/material/Skeleton";

interface Props extends AvatarProps {
    profile: User | undefined;
    loading?: boolean;
    skeleton?: SkeletonProps;
}

export const Avatar: React.FC<Props> = memo(({ profile, loading, skeleton, ...rest }) => {
    if (loading) {
        return <Skeleton animation="pulse" variant="circular" sx={{ bgcolor: "grey.700" }} {...skeleton} />;
    }
    return <MUIAvatar {...rest}>{profile?.userName?.charAt(0).toUpperCase() || "U"}</MUIAvatar>;
});
