import { FC } from "react";
import Box from "@mui/material/Box";
import { Blurhash } from "react-blurhash";
import Skeleton from "@mui/material/Skeleton";
import CircularProgress from "@mui/material/CircularProgress";

interface MediaItemLoaderProps {
    blurHash: string | null;
}

export const MediaItemLoader: FC<MediaItemLoaderProps> = ({ blurHash }) => {
    return (
        <Box
            sx={{
                inset: 0,
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                width: "100%",
                height: "100%",
                justifyContent: "center",
            }}
        >
            {blurHash ? (
                <>
                    <Blurhash hash={blurHash} width="100%" height="100%" resolutionX={32} resolutionY={32} punch={1} />
                    <CircularProgress sx={{ position: "absolute" }} size="24px" color="inherit" />
                </>
            ) : (
                <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
            )}
        </Box>
    );
};
