import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Theme } from "@mui/material";
import { Navigation } from "swiper/modules";
import { Photo } from "@app/core/services";
import { alpha } from "@mui/material/styles";
import { useTheme } from "@app/core/providers";
import { FC, CSSProperties, MouseEvent } from "react";
import { Swiper, SwiperProps, SwiperSlide } from "swiper/react";
import { stopEventPropagation } from "@app/core/utils/general.ts";

interface PhotoSwiperProps extends SwiperProps {
    photos: Photo[];
    onSwiperSlideClick?: (e: MouseEvent<HTMLElement>) => void;
}

export const PhotoSwiper: FC<PhotoSwiperProps> = ({ photos = [], onSwiperSlideClick, ...rest }) => {
    const theme: Theme = useTheme();
    const handleImageClick = (e: MouseEvent<HTMLElement>): void => stopEventPropagation(e);

    return (
        <Swiper
            loop
            zoom
            navigation
            grabCursor
            slidesPerView={1}
            modules={[Navigation]}
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
            {...rest}
        >
            {photos.map(photo => (
                <SwiperSlide
                    key={photo.id}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        userSelect: "none",
                    }}
                    onClick={onSwiperSlideClick}
                >
                    <img
                        onClick={handleImageClick}
                        src={photo.src}
                        alt={`photo_${photo.id}`}
                        draggable="false"
                        style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            borderRadius: "12px",
                        }}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};
