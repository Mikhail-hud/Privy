import React from "react";
import MUIAvatar, { AvatarProps } from "@mui/material/Avatar";
import Skeleton, { SkeletonProps } from "@mui/material/Skeleton";

interface Props extends AvatarProps {
    userName?: string;
    loading?: boolean;
    skeleton?: SkeletonProps;
}

export const Avatar: React.FC<Props> = memo(({ userName = "", loading, skeleton, ...rest }) => {
    if (loading) {
        return <Skeleton animation="pulse" variant="circular" sx={{ bgcolor: "grey.700" }} {...skeleton} />;
    }
    return <MUIAvatar {...rest}>{userName?.charAt(0).toUpperCase() || "U"}</MUIAvatar>;
});
