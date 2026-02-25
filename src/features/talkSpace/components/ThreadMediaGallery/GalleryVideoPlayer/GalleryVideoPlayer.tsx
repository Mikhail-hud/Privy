import Box from "@mui/material/Box";
import { useIsMobile } from "@app/core/hooks";
import { ThreadMedia } from "@app/core/services";
import { ActionIconButton } from "@app/core/components";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { stopEventPropagation } from "@app/core/utils/general.ts";
import { useVideoFeed } from "@app/features/talkSpace/components";
import { RATIO_16_9, RATIO_4_3 } from "@app/core/constants/general.ts";
import { FC, MouseEvent, RefObject, useEffect, useRef, useState } from "react";

interface GalleryVideoPlayerProps {
    item: ThreadMedia;
    isActive: boolean;
    initialTime?: number;
}

export const GalleryVideoPlayer: FC<GalleryVideoPlayerProps> = ({ item, isActive, initialTime }) => {
    const isMobile: boolean = useIsMobile();
    const { toggleGlobalMute, isGlobalMuted, syncTimeFromModal } = useVideoFeed();
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef: RefObject<HTMLVideoElement | null> = useRef<HTMLVideoElement | null>(null);
    const defaultRatio: number = isMobile ? RATIO_4_3 : RATIO_16_9;
    const ratio: number = item.width && item.height ? item.width / item.height : defaultRatio;

    // Ref to track if we've set the initial time for the video. This is necessary because when we switch between videos in the gallery, we want to reset the time to 0, but if we come back to a video we've already played, we want to start from where we left off (or the provided initialTime if it's the first time we're playing it).
    const hasSetInitialTime: RefObject<boolean> = useRef(false);

    useEffect((): void | (() => void) => {
        const video: HTMLVideoElement | null = videoRef.current;
        if (!video) return undefined; // Explicitly return undefined for early exit

        if (isActive) {
            if (!hasSetInitialTime.current && initialTime) {
                video.currentTime = initialTime;
                hasSetInitialTime.current = true;
            }

            video
                .play()
                .then((): void => setIsPlaying(true))
                .catch((): void => setIsPlaying(false));
        } else {
            if (video.currentTime > 0) {
                syncTimeFromModal(item.src, video.currentTime);
            }
            video.pause();
            setIsPlaying(false);
            hasSetInitialTime.current = false;
        }

        // Return a cleanup function, not a function call
        return () => {
            if (video && video.currentTime > 0) {
                syncTimeFromModal(item.src, video.currentTime);
            }
        };
    }, [isActive, initialTime, syncTimeFromModal, item.src]);

    const handleTogglePlay = (e: MouseEvent<HTMLElement>): void => {
        stopEventPropagation(e);
        const video: HTMLVideoElement | null = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video
                .play()
                .then((): void => setIsPlaying(true))
                .catch((): void => setIsPlaying(false));
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    const handleMuteClick = (e: MouseEvent<HTMLElement>): void => {
        stopEventPropagation(e);
        toggleGlobalMute(e);
    };

    return (
        <Box
            onClick={handleTogglePlay}
            sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                WebkitTouchCallout: "none",
                userSelect: "none",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    display: "flex",
                    width: `min(100%, calc(100dvh * ${ratio}))`,
                    height: `min(100%, calc(100dvw / ${ratio}))`,
                }}
            >
                <video
                    ref={videoRef}
                    src={item.src}
                    poster={item?.posterUrl ?? ""}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        pointerEvents: "none",
                        borderRadius: "12px",
                    }}
                    controls={false}
                    controlsList="nodownload"
                    muted={isGlobalMuted}
                    playsInline
                    loop
                    preload="metadata"
                />

                {!isPlaying && (
                    <ActionIconButton
                        icon={<PlayArrowIcon fontSize="large" />}
                        sx={{
                            zIndex: 2,
                            top: "50%",
                            left: "50%",
                            position: "absolute",
                            transform: "translate(-50%, -50%)",
                        }}
                    />
                )}
                <ActionIconButton
                    onClick={handleMuteClick}
                    sx={{ position: "absolute", bottom: 16, right: 16, zIndex: 11 }}
                    icon={isGlobalMuted ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
                />
            </Box>
        </Box>
    );
};
