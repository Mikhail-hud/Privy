import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import CloseIcon from "@mui/icons-material/Close";
import { useBodyOverflowLock } from "@app/core/hooks";
import { ActionIconButton } from "@app/core/components";
import { MediaType, ThreadMedia } from "@app/core/services";
import { stopEventPropagation } from "@app/core/utils/general.ts";
import { memo, MouseEvent, FC, useCallback, WheelEventHandler } from "react";
import { GalleryVideoPlayer } from "@app/features/talkSpace/components/ThreadMediaGallery/GalleryVideoPlayer";

interface ThreadMediaBackdropProps {
    onClose: (e: MouseEvent<HTMLElement> | WheelEventHandler<HTMLDivElement> | undefined) => void;
    open: boolean;
    media: ThreadMedia | null;
}

const ThreadMediaBackdropComponent: FC<ThreadMediaBackdropProps> = ({ onClose, open, media }) => {
    useBodyOverflowLock(open);

    const handleCloseInternal = useCallback(
        (e: WheelEventHandler<HTMLDivElement> | MouseEvent<HTMLElement>): void => {
            onClose(e);
        },
        [onClose]
    );

    const handleBackdropClick = (e: MouseEvent<HTMLElement>) => {
        stopEventPropagation(e);
        onClose(e);
    };

    const handleImageClick = (e: MouseEvent<HTMLElement>): void => stopEventPropagation(e);

    const isVideo: boolean = media?.type === MediaType.VIDEO;
    return (
        <Backdrop
            open={open}
            unmountOnExit
            transitionDuration={400}
            onClick={handleBackdropClick}
            sx={{ zIndex: theme => theme.zIndex.drawer + 1, background: "black", touchAction: "none" }}
        >
            <Box
                onWheel={handleCloseInternal}
                sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}
            >
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
                    {isVideo && media ? (
                        <GalleryVideoPlayer isActive={true} item={media} />
                    ) : (
                        <img
                            onClick={handleImageClick}
                            loading="lazy"
                            alt={media?.src}
                            src={media?.src}
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
