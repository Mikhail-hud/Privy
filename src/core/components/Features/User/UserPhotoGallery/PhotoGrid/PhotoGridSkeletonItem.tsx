import { FC } from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { SystemStyleObject, Theme } from "@mui/system";

interface PhotoGridSkeletonItemProps {
    sx: SystemStyleObject<Theme>;
}

export const PhotoGridSkeletonItem: FC<PhotoGridSkeletonItemProps> = ({ sx }) => (
    <Box sx={sx}>
        <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" sx={{ borderRadius: "8px" }} />
    </Box>
);
