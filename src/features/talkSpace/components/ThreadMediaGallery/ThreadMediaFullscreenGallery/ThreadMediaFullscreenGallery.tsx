import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Box from "@mui/material/Box";
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Backdrop from "@mui/material/Backdrop";
import { useTheme } from "@app/core/providers";
import CloseIcon from "@mui/icons-material/Close";
import { ThreadMedia } from "@app/core/services";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useBodyOverflowLock } from "@app/core/hooks";
import { FC, MouseEvent, CSSProperties } from "react";
import { ActionIconButton } from "@app/core/components";
import { stopEventPropagation } from "@app/core/utils/general.ts";

interface ThreadMediaFullscreenGalleryProps {
    open: boolean;
    media: ThreadMedia[];
    initialSlide: number;
    onClose: (e: MouseEvent<HTMLElement>) => void;
}

export const ThreadMediaFullscreenGallery: FC<ThreadMediaFullscreenGalleryProps> = ({
    open,
    onClose,
    media,
    initialSlide,
}) => {
    const theme: Theme = useTheme();
    useBodyOverflowLock(open);

    if (!open) return null;

    const handleBackdropClick = (e: MouseEvent<HTMLElement>): void => stopEventPropagation(e);

    return (
        <Backdrop
            open={open}
            onClick={handleBackdropClick}
            sx={{
                zIndex: theme => theme.zIndex.drawer + 1,
                background: "black",
                touchAction: "none",
            }}
        >
            <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
                <Box sx={{ p: 2, position: "fixed", zIndex: 10 }}>
                    <ActionIconButton icon={<CloseIcon />} onClick={onClose} />
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
                                padding: "8px 0",
                                "--swiper-navigation-color": theme.palette.common.white,
                                "--swiper-pagination-color": theme.palette.common.white,
                                "--swiper-pagination-bullet-inactive-color": alpha(theme.palette.common.white, 0.9),
                            } as CSSProperties
                        }
                    >
                        {media.map(item => {
                            const isVideo: boolean =
                                item.mimeType.startsWith("video/") ||
                                item.mimeType.startsWith("application/octet-stream");

                            return (
                                <SwiperSlide
                                    key={item.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {isVideo ? (
                                        <video
                                            controls
                                            src={item.src}
                                            style={{ maxWidth: "100%", maxHeight: "100%", outline: "none" }}
                                        />
                                    ) : (
                                        <img
                                            src={item.src}
                                            alt={item.src}
                                            style={{
                                                maxWidth: "100%",
                                                maxHeight: "100%",
                                                objectFit: "contain",
                                                borderRadius: "12px",
                                            }}
                                        />
                                    )}
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </Box>
            </Box>
        </Backdrop>
    );
};
