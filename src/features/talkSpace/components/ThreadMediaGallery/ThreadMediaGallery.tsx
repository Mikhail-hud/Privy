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
import { ThreadMediaFullscreenGallery } from "@app/features/talkSpace/components/ThreadMediaGallery/ThreadMediaFullscreenGallery";

interface ThreadMediaGalleryProps {
    threadMedia: ThreadMedia[];
}

export const ThreadMediaGallery: FC<ThreadMediaGalleryProps> = ({ threadMedia }) => {
    const [fullscreenOpen, setFullscreenOpen] = useState<boolean>(false);
    const [initialSlide, setInitialSlide] = useState<number>(0);

    const handleOpenGallery = (index: number): void => {
        setInitialSlide(index);
        setFullscreenOpen(true);
    };

    const handleCloseGallery = (e: MouseEvent<HTMLElement>): void => {
        stopEventPropagation(e);
        setFullscreenOpen(false);
    };

    const handleMediaClick =
        (index: number) =>
        (e: MouseEvent<HTMLElement>): void => {
            stopEventPropagation(e);
            handleOpenGallery(index);
        };

    if (threadMedia.length === 1) {
        return <SingleThreadMedia media={threadMedia[0]} />;
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
            <ThreadMediaFullscreenGallery
                open={fullscreenOpen}
                onClose={handleCloseGallery}
                media={threadMedia}
                initialSlide={initialSlide}
            />
        </>
    );
};
