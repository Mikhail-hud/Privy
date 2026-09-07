import { FC } from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CircularProgress from "@mui/material/CircularProgress";

export interface VideoStatusPlaceholderProps {
    isFailed: boolean;
}

export const VideoStatusPlaceholder: FC<VideoStatusPlaceholderProps> = ({ isFailed }) => {
    return (
        <>
            <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
            <Box
                sx={{
                    inset: 0,
                    gap: 1,
                    zIndex: 1,
                    display: "flex",
                    position: "absolute",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                    color: "common.white",
                    textAlign: "center",
                    textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                }}
            >
                {isFailed ? (
                    <>
                        <ErrorOutlineIcon fontSize="small" />
                        <Typography variant="caption">Video could not be processed</Typography>
                    </>
                ) : (
                    <>
                        <CircularProgress size="24px" color="inherit" />
                        <Typography variant="caption">Processing video…</Typography>
                    </>
                )}
            </Box>
        </>
    );
};
