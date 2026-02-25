import Box from "@mui/material/Box";
import { memo, MouseEvent, FC } from "react";
import Backdrop from "@mui/material/Backdrop";
import CloseIcon from "@mui/icons-material/Close";
import { useBodyOverflowLock } from "@app/core/hooks";
import { ActionIconButton } from "@app/core/components";
import { MediaType, ThreadMedia } from "@app/core/services";
import { stopEventPropagation } from "@app/core/utils/general.ts";
import { useVideoFeed } from "@app/features/talkSpace/components";
import { GalleryVideoPlayer } from "@app/features/talkSpace/components/ThreadMediaGallery/GalleryVideoPlayer";

interface ThreadMediaBackdropProps {
    onClose: (e: MouseEvent<HTMLElement>) => void;
    open: boolean;
    media: ThreadMedia | null;
    initialTime: number;
}

const ThreadMediaBackdropComponent: FC<ThreadMediaBackdropProps> = ({ onClose, open, media, initialTime }) => {
    useBodyOverflowLock(open);

    const { setGlobalPause } = useVideoFeed();

    // When the backdrop opens, we want to pause all videos in the gallery to prevent multiple videos from playing at the same time. When it closes, we want to unpause them so that if the user opens the gallery again, the videos will play from where they left off.
    useEffect((): void => {
        setGlobalPause(open);
    }, [open, setGlobalPause]);

    if (!open || !media) return null;

    const { src } = media;

    const handleBackdropClick = (e: MouseEvent<HTMLElement>) => {
        stopEventPropagation(e);
        onClose(e);
    };

    const handleImageClick = (e: MouseEvent<HTMLElement>): void => stopEventPropagation(e);

    const isVideo: boolean = media.type === MediaType.VIDEO;
    return (
        <Backdrop
            open={open}
            onClick={handleBackdropClick}
            sx={{ zIndex: theme => theme.zIndex.drawer + 1, background: "black", touchAction: "none" }}
        >
            <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
                <Box sx={{ p: 2, position: "fixed", zIndex: 10 }}>
                    <ActionIconButton icon={<CloseIcon />} onClick={onClose} />
                </Box>
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        height: "100%",
                        alignItems: "center",
                        overflow: "hidden",
                        justifyContent: "center",
                    }}
                    onClick={handleBackdropClick}
                >
                    {isVideo ? (
                        <GalleryVideoPlayer isActive={true} item={media} initialTime={initialTime} />
                    ) : (
                        <img
                            onClick={handleImageClick}
                            loading="lazy"
                            alt={src}
                            src={src}
                            style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "cover",
                            }}
                        />
                    )}
                </Box>
            </Box>
        </Backdrop>
    );
};

export const ThreadMediaBackdrop = memo(ThreadMediaBackdropComponent);
