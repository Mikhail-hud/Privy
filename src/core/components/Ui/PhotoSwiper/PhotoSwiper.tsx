import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Theme } from "@mui/material";
import { Photo } from "@app/core/services";
import { FC, CSSProperties } from "react";
import { alpha } from "@mui/material/styles";
import { useTheme } from "@app/core/providers";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperProps, SwiperSlide } from "swiper/react";

interface PhotoSwiperProps extends SwiperProps {
    photos: Photo[];
}

export const PhotoSwiper: FC<PhotoSwiperProps> = ({ photos = [], ...rest }) => {
    const theme: Theme = useTheme();
    return (
        <Swiper
            loop
            zoom
            navigation
            grabCursor
            slidesPerView={1}
            modules={[Navigation, Pagination]}
            pagination={{ clickable: true, dynamicBullets: true }}
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
                >
                    <img
                        src={photo.src}
                        alt={`photo_${photo.id}`}
                        draggable="false"
                        style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            display: "flex",
                            margin: "0 auto",
                        }}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};
