import Box from "@mui/material/Box";
import { useIsMobile } from "@app/core/hooks";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { ActionIconButton } from "@app/core/components";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { MediaType, ThreadMedia } from "@app/core/services";
import CircularProgress from "@mui/material/CircularProgress";
import { stopEventPropagation } from "@app/core/utils/general.ts";
import { useVideoFeed } from "@app/features/talkSpace/components";
import { RATIO_16_9, RATIO_4_3 } from "@app/core/constants/general.ts";
import { FC, MouseEvent, useState, useRef, useEffect, RefObject } from "react";

interface MediaItemProps {
    media: ThreadMedia;
    onClick?: (e: MouseEvent<HTMLElement>) => void;
}

export const MediaItem: FC<MediaItemProps> = ({ media, onClick }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const { registerVideo, unregisterVideo, isGlobalMuted, toggleGlobalMute } = useVideoFeed();

    const isVideo: boolean = media.type === MediaType.VIDEO;
    const isMobile: boolean = useIsMobile();
    const defaultRatio: number = isMobile ? RATIO_4_3 : RATIO_16_9;
    const videoRef: RefObject<HTMLVideoElement | null> = useRef<HTMLVideoElement>(null);
    const aspectRatio: string | number =
        media.width && media.height ? `${media.width} / ${media.height}` : defaultRatio;

    useEffect(() => {
        const videoElement: HTMLVideoElement | null = videoRef.current;
        if (!isVideo || !videoElement) return;
        registerVideo(media.id, videoElement);
        return (): void => {
            unregisterVideo(media.id, videoElement);
        };
    }, [isVideo, registerVideo, unregisterVideo, media.id]);

    const handleLoad = (): void => setIsLoaded(true);

    const handleMute = (e: MouseEvent<HTMLElement>): void => {
        stopEventPropagation(e);
        toggleGlobalMute(e);
    };
    const handleContextMenu = (e: MouseEvent<HTMLElement>): void => e.preventDefault();

    const handleBoxClick = (e: MouseEvent<HTMLElement>): void => onClick?.(e);

    return (
        <Box
            onContextMenu={handleContextMenu}
            onClick={handleBoxClick}
            sx={theme => ({
                height: "100%",
                aspectRatio,
                maxHeight: 350,
                overflow: "hidden",
                borderRadius: "12px",
                position: "relative",
                cursor: "pointer",
                bgcolor: "action.hover",
                border: `1px solid ${theme.palette.divider}`,
                WebkitTouchCallout: "none",
                userSelect: "none",
                WebkitUserSelect: "none",
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
                <>
                    <video
                        ref={videoRef}
                        onLoadedData={handleLoad}
                        src={media.src}
                        poster={media.posterUrl ?? ""}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            pointerEvents: "none",
                        }}
                        loop
                        playsInline
                        controls={false}
                        preload="metadata"
                        muted={isGlobalMuted}
                    />
                    <ActionIconButton
                        onClick={handleMute}
                        sx={{ position: "absolute", bottom: 8, right: 8 }}
                        icon={isGlobalMuted ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
                    />
                </>
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
                        pointerEvents: "none",
                    }}
                />
            )}
        </Box>
    );
};
