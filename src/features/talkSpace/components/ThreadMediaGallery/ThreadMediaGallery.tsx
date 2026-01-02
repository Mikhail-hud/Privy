import "swiper/css";
import "swiper/css/pagination";
import { CSSProperties, FC } from "react";
import { FreeMode } from "swiper/modules";
import { Box, Theme } from "@mui/material";
import { useTheme } from "@app/core/providers";
import { ThreadMedia } from "@app/core/services";
import { Swiper, SwiperSlide } from "swiper/react";
import { stopEventPropagation } from "@app/core/utils/general.ts";

interface ThreadMediaGalleryProps {
    threadMedia: ThreadMedia[];
}

export const ThreadMediaGallery: FC<ThreadMediaGalleryProps> = ({ threadMedia }) => {
    const theme: Theme = useTheme();

    if (threadMedia.length === 1) {
        const media: ThreadMedia = threadMedia[0];
        const isVideo: boolean = media.mimeType.startsWith("video/");

        return (
            <Box
                onClick={stopEventPropagation}
                sx={{
                    my: 1,
                    maxHeight: 350,
                    display: "flex",
                    borderRadius: "12px",
                    width: "fit-content",
                    overflow: "hidden",
                    justifyContent: "flex-start",
                    backgroundColor: theme.palette.action.hover,
                    border: `1px solid ${theme.palette.divider}`,
                }}
            >
                {isVideo ? (
                    <video
                        src={media.src}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                        }}
                        controls={true}
                        muted
                    />
                ) : (
                    <img
                        loading="lazy"
                        alt={media.src}
                        src={media.src}
                        style={{
                            maxHeight: "350px",
                            maxWidth: "100%",
                            width: "auto",
                            height: "auto",
                            display: "block",
                        }}
                    />
                )}
            </Box>
        );
    }

    return (
        <Box
            sx={{
                my: 1,
                minWidth: 0,
                width: "100%",
                height: { xxs: 75, xs: 100, sm: 150 },
            }}
            onClick={stopEventPropagation}
        >
            <Swiper
                freeMode
                grabCursor
                spaceBetween={10}
                modules={[FreeMode]}
                slidesPerView="auto"
                style={
                    {
                        width: "100%",
                        height: "100%",
                        paddingBottom: "2px",
                    } as CSSProperties
                }
            >
                {threadMedia.map((media: ThreadMedia) => {
                    const isVideo: boolean = media.mimeType.startsWith("video/");

                    return (
                        <SwiperSlide
                            key={media.id}
                            style={{
                                width: "fit-content",
                                height: "100%",
                                position: "relative",
                                borderRadius: "12px",
                                overflow: "hidden",
                                border: `1px solid ${theme.palette.divider}`,
                                backgroundColor: theme.palette.action.hover,
                            }}
                        >
                            {isVideo ? (
                                <video
                                    src={media.src}
                                    // TODO: ADD proper video preview handling (play on hover, etc.)
                                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                    controls={false}
                                    muted // Автоплей обычно требует muted
                                />
                            ) : (
                                <img loading="lazy" alt="preview" src={media.src} style={{ height: "100%" }} />
                            )}
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </Box>
    );
};
