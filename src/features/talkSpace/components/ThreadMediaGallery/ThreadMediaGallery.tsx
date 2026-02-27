import "swiper/css";
import "swiper/css/pagination";
import Box from "@mui/material/Box";
import { FreeMode } from "swiper/modules";
import { ThreadMedia } from "@app/core/services";
import { Swiper, SwiperSlide } from "swiper/react";
import { CSSProperties, FC, MouseEvent } from "react";
import { stopEventPropagation } from "@app/core/utils/general.ts";
import { MediaItem } from "@app/features/talkSpace/components/ThreadMediaGallery/MediaItem";
import { SingleThreadMedia } from "@app/features/talkSpace/components/ThreadMediaGallery/SingleThreadMedia";

interface ThreadMediaGalleryProps {
    threadMedia: ThreadMedia[];
    handleOpenThreadMediaBackdrop: (media: ThreadMedia) => void;
    handleOpenThreadMediaGalleryBackdrop: (media: ThreadMedia[], index: number) => void;
}

export const ThreadMediaGallery: FC<ThreadMediaGalleryProps> = ({
    threadMedia,
    handleOpenThreadMediaBackdrop,
    handleOpenThreadMediaGalleryBackdrop,
}) => {
    const handleMediaClick =
        (index: number) =>
        (e: MouseEvent<HTMLElement>): void => {
            stopEventPropagation(e);
            handleOpenThreadMediaGalleryBackdrop?.(threadMedia, index);
        };

    if (threadMedia.length === 1) {
        return (
            <SingleThreadMedia media={threadMedia[0]} handleOpenThreadMediaBackdrop={handleOpenThreadMediaBackdrop} />
        );
    }

    return (
        <>
            <Box
                sx={{
                    minWidth: 0,
                    width: "100%",
                    height: { xxs: 150, xs: 200, sm: 250, md: 275 },
                }}
                onClick={stopEventPropagation}
            >
                <Swiper
                    freeMode
                    grabCursor
                    spaceBetween={10}
                    modules={[FreeMode]}
                    slidesPerView="auto"
                    style={{ width: "100%", height: "100%", padding: "5px 0" } as CSSProperties}
                >
                    {threadMedia.map((media: ThreadMedia, index) => (
                        <SwiperSlide key={media.id} style={{ width: "auto", height: "100%", borderRadius: "12px" }}>
                            <MediaItem media={media} onClick={handleMediaClick(index)} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>
        </>
    );
};
