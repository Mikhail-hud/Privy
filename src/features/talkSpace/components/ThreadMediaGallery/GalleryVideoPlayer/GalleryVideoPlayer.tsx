import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
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
import { FC, MouseEvent, useEffect, useRef, useState, useMemo, RefObject, useLayoutEffect } from "react";

interface GalleryVideoPlayerProps {
    item: ThreadMedia;
    isActive: boolean;
}

export const GalleryVideoPlayer: FC<GalleryVideoPlayerProps> = ({ item, isActive }) => {
    const isMobile: boolean = useIsMobile();
    const { toggleGlobalMute, isGlobalMuted, getFeedVideoElement, setGlobalPause } = useVideoFeed();
    const isInitialMount: RefObject<boolean> = useRef<boolean>(true);

    const containerRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
    const fallbackVideoRef: RefObject<HTMLVideoElement | null> = useRef<HTMLVideoElement>(null);
    const originalStateRef = useRef<{ parent: HTMLElement | null; styles: string | null } | null>(null);

    const defaultRatio: number = isMobile ? RATIO_4_3 : RATIO_16_9;
    const [isPlaying, setIsPlaying] = useState(false);
    const [ratio, setRatio] = useState<number>(defaultRatio);

    const onPlay = (): void => setIsPlaying(true);
    const onPause = (): void => setIsPlaying(false);

    const feedVideoNode: HTMLVideoElement | null = useMemo(
        (): HTMLVideoElement | null => getFeedVideoElement(item.id),
        [getFeedVideoElement, item.id]
    );
    const activeVideo: HTMLVideoElement | null = feedVideoNode || fallbackVideoRef.current;

    useLayoutEffect(() => {
        if (feedVideoNode && containerRef.current) {
            if (feedVideoNode.videoWidth && feedVideoNode.videoHeight) {
                setRatio(feedVideoNode.videoWidth / feedVideoNode.videoHeight);
            }

            originalStateRef.current = {
                parent: feedVideoNode.parentElement,
                styles: feedVideoNode.getAttribute("style"),
            };

            if (feedVideoNode.parentElement !== containerRef.current) {
                containerRef.current.appendChild(feedVideoNode);
            }

            feedVideoNode.style.height = "100%";
            feedVideoNode.style.width = "auto";
            feedVideoNode.style.maxWidth = "100%";
            feedVideoNode.style.objectFit = "cover";
            feedVideoNode.style.display = "block";
            feedVideoNode.style.pointerEvents = "none";
            feedVideoNode.style.borderRadius = "12px";

            return () => {
                const state = originalStateRef.current;
                if (state && state.parent) {
                    state.parent.appendChild(feedVideoNode);
                    if (state.styles) {
                        feedVideoNode.setAttribute("style", state.styles);
                    } else {
                        feedVideoNode.removeAttribute("style");
                    }
                }
            };
        }
    }, [feedVideoNode, isActive]);

    useEffect(() => {
        if (!activeVideo) return;
        const onLoadedMetadata = (): void => {
            if (activeVideo.videoWidth && activeVideo.videoHeight) {
                setRatio(activeVideo.videoWidth / activeVideo.videoHeight);
            }
        };

        activeVideo.addEventListener("play", onPlay);
        activeVideo.addEventListener("pause", onPause);
        activeVideo.addEventListener("loadedmetadata", onLoadedMetadata);
        setIsPlaying(!activeVideo.paused);

        return (): void => {
            activeVideo.removeEventListener("play", onPlay);
            activeVideo.removeEventListener("pause", onPause);
            activeVideo.removeEventListener("loadedmetadata", onLoadedMetadata);
        };
    }, [activeVideo]);

    useEffect((): void => {
        if (!activeVideo) return;

        if (isActive) {
            isInitialMount.current = false;
            setGlobalPause(true, item.id);
            activeVideo.play();
        } else {
            if (!isInitialMount.current) {
                activeVideo.pause();
                if (!feedVideoNode) activeVideo.currentTime = 0;
            }
        }
    }, [isActive, activeVideo, feedVideoNode, setGlobalPause, item.id]);

    const handleTogglePlay = (e: MouseEvent<HTMLElement>): void => {
        stopEventPropagation(e);
        if (!activeVideo) return;
        if (activeVideo.paused) {
            activeVideo.play();
        } else {
            activeVideo.pause();
        }
    };

    const handleMuteClick = (e: MouseEvent<HTMLElement>): void => {
        stopEventPropagation(e);
        toggleGlobalMute(e);
    };

    return (
        <Box
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
                onClick={handleTogglePlay}
                sx={{
                    position: "relative",
                    display: "flex",
                    width: `min(100%, calc(100dvh * ${ratio}))`,
                    height: `min(100%, calc(100dvw / ${ratio}))`,
                }}
            >
                {feedVideoNode ? (
                    <div ref={containerRef} style={{ display: "contents" }} />
                ) : (
                    <video
                        ref={fallbackVideoRef}
                        src={item.src}
                        poster={item?.posterUrl ?? ""}
                        style={{
                            height: "100%",
                            width: "auto",
                            maxWidth: "100%",
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
                )}

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
