import "swiper/css";
import { FC } from "react";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { ThreadMedia } from "@app/core/services";
import Typography from "@mui/material/Typography";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { isMediaFailed } from "@app/core/utils/threadMedia.ts";

interface GalleryVideoPlayerPlaceholderProps {
    mediaItem: ThreadMedia;
    ratio: number;
}

export const GalleryVideoPlayerPlaceholder: FC<GalleryVideoPlayerPlaceholderProps> = ({ mediaItem, ratio }) => {
    return (
        <Box
            sx={{
                gap: 1,
                display: "flex",
                width: "min(100%, 480px)",
                height: "100%",
                aspectRatio: String(ratio),
                alignItems: "center",
                position: "relative",
                borderRadius: "12px",
                overflow: "hidden",
                flexDirection: "column",
                justifyContent: "center",
            }}
        >
            <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
            <Box
                sx={{
                    inset: 0,
                    gap: 1,
                    display: "flex",
                    position: "absolute",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                    color: "common.white",
                    textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                }}
            >
                {isMediaFailed(mediaItem) ? <ErrorOutlineIcon /> : null}
                <Typography variant="caption">
                    {isMediaFailed(mediaItem) ? "Video could not be processed" : "Processing video…"}
                </Typography>
            </Box>
        </Box>
    );
};
