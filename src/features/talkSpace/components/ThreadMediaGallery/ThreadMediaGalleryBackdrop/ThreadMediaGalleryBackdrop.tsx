import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Box from "@mui/material/Box";
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Backdrop from "@mui/material/Backdrop";
import { useTheme } from "@app/core/providers";
import CloseIcon from "@mui/icons-material/Close";
import { Swiper, SwiperSlide } from "swiper/react";
import { useBodyOverflowLock } from "@app/core/hooks";
import { Navigation, Pagination } from "swiper/modules";
import { ActionIconButton } from "@app/core/components";
import { MediaType, ThreadMedia } from "@app/core/services";
import { stopEventPropagation } from "@app/core/utils/general.ts";
import { FC, MouseEvent, CSSProperties, memo, useCallback, WheelEventHandler } from "react";
import { GalleryVideoPlayer } from "@app/features/talkSpace/components/ThreadMediaGallery/GalleryVideoPlayer";

interface ThreadMediaGalleryBackdropProps {
    open: boolean;
    media: ThreadMedia[];
    initialSlide: number;
    onClose: (e: MouseEvent<HTMLElement> | WheelEventHandler<HTMLDivElement> | undefined) => void;
}

const ThreadMediaGalleryBackdropComponent: FC<ThreadMediaGalleryBackdropProps> = ({
    open,
    onClose,
    media,
    initialSlide,
}) => {
    const theme: Theme = useTheme();
    useBodyOverflowLock(open);

    const handleCloseInternal = useCallback(
        (e: WheelEventHandler<HTMLDivElement> | MouseEvent<HTMLElement>): void => {
            onClose(e);
        },
        [onClose]
    );

    const handleBackdropClick = (e: MouseEvent<HTMLElement>): void => stopEventPropagation(e);

    return (
        <Backdrop
            open={open}
            unmountOnExit
            transitionDuration={400}
            onClick={handleBackdropClick}
            sx={{
                zIndex: theme => theme.zIndex.drawer + 1,
                background: "black",
                touchAction: "none",
            }}
        >
            <Box
                onWheel={handleCloseInternal}
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    outline: "none",
                }}
            >
                <Box sx={{ p: 2, position: "fixed", zIndex: 10 }}>
                    <ActionIconButton icon={<CloseIcon />} onClick={handleCloseInternal} />
                </Box>
                <Box
                    sx={{
                        flexGrow: 1,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        overflow: "hidden",
                    }}
                    onClick={handleBackdropClick}
                >
                    <Swiper
                        loop
                        zoom
                        navigation
                        grabCursor
                        slidesPerView={1}
                        initialSlide={initialSlide}
                        modules={[Navigation, Pagination]}
                        pagination={{ clickable: true }}
                        style={
                            {
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                "--swiper-navigation-color": theme.palette.common.white,
                                "--swiper-pagination-color": theme.palette.common.white,
                                "--swiper-pagination-bullet-inactive-color": alpha(theme.palette.common.white, 0.9),
                            } as CSSProperties
                        }
                    >
                        {media.map(item => {
                            const isVideo: boolean = item.type === MediaType.VIDEO;

                            return (
                                <SwiperSlide
                                    key={item.id}
                                    onClick={onClose}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {({ isActive }) =>
                                        isVideo ? (
                                            <GalleryVideoPlayer item={item} isActive={isActive} />
                                        ) : (
                                            <Box
                                                sx={{
                                                    width: "100%",
                                                    height: "100%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    WebkitTouchCallout: "none",
                                                    userSelect: "none",
                                                }}
                                            >
                                                <img
                                                    src={item.src}
                                                    draggable={false}
                                                    alt={item.src}
                                                    style={{
                                                        maxWidth: "100%",
                                                        maxHeight: "100%",
                                                        objectFit: "contain",
                                                        borderRadius: "12px",
                                                        pointerEvents: "none",
                                                    }}
                                                />
                                            </Box>
                                        )
                                    }
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </Box>
            </Box>
        </Backdrop>
    );
};

export const ThreadMediaGalleryBackdrop = memo(ThreadMediaGalleryBackdropComponent);
