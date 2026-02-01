import Box from "@mui/material/Box";
import { useIsMobile } from "@app/core/hooks";
import { FC, MouseEvent, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { MediaType, ThreadMedia } from "@app/core/services";
import { RATIO_16_9, RATIO_4_3 } from "@app/core/constants/general.ts";

interface MediaItemProps {
    media: ThreadMedia;
    onClick?: (e: MouseEvent<HTMLElement>) => void;
}

export const MediaItem: FC<MediaItemProps> = ({ media, onClick }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const isVideo: boolean = media.type === MediaType.VIDEO;
    const isMobile: boolean = useIsMobile();
    const defaultRatio: number = isMobile ? RATIO_4_3 : RATIO_16_9;
    const aspectRatio: string | number =
        media.width && media.height ? `${media.width} / ${media.height}` : defaultRatio;

    const handleLoad = (): void => setIsLoaded(true);
    return (
        <Box
            onClick={onClick}
            sx={theme => ({
                // Required to corectly apply aspect ratio in Swiper
                height: "100%",
                aspectRatio,
                maxHeight: 350,
                overflow: "hidden",
                borderRadius: "12px",
                position: "relative",
                cursor: "pointer",
                bgcolor: "action.hover",
                border: `1px solid ${theme.palette.divider}`,
            })}
        >
            {!isLoaded && (
                <Box
                    sx={{
                        inset: 0,
                        zIndex: 1,
                        display: "flex",
                        position: "absolute",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CircularProgress size="30px" color="inherit" />
                </Box>
            )}
            {isVideo ? (
                <video
                    onLoadedData={handleLoad}
                    src={media.src}
                    poster={media.posterUrl ?? ""}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                    controls
                    muted
                    playsInline
                    preload="metadata"
                />
            ) : (
                <img
                    onLoad={handleLoad}
                    loading="lazy"
                    alt={media.src}
                    src={media.src}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            )}
        </Box>
    );
};
