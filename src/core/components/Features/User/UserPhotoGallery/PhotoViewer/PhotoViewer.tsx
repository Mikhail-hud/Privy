import { Backdrop, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Photo, PhotoSlots } from "@app/core/services";
import { useBodyOverflowLock } from "@app/core/hooks";
import { FC, MouseEvent, WheelEventHandler } from "react";
import { PublicIcon, PrivateIcon } from "@app/core/assets/icons";
import { PhotoSwiper, ActionIconButton, ProfilePhotoActions } from "@app/core/components";

interface PhotoViewerProps {
    open: boolean;
    photo: Photo | null;
    photos: Photo[];
    photoSlots: PhotoSlots;
    isOwner: boolean;
    initialSlide: number | null;
    onSlideChange: (index: number) => void;
    onClose: (e: MouseEvent<HTMLElement> | WheelEventHandler<HTMLDivElement> | undefined) => void;
}

export const PhotoViewer: FC<PhotoViewerProps> = memo(
    ({ open, onClose, photo, photos, initialSlide, onSlideChange, isOwner, photoSlots }) => {
        useBodyOverflowLock(open);
        const isPublicPhoto: boolean = photoSlots?.publicPhoto?.id === photo?.id;
        const isPrivatePhoto: boolean = photoSlots?.privatePhoto?.id === photo?.id;
        return (
            <Backdrop
                transitionDuration={400}
                sx={{ zIndex: theme => theme.zIndex.drawer + 1, background: "black" }}
                open={open}
            >
                <Box onWheel={onClose} sx={{ width: "100%", height: "100%" }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            position: "fixed",
                            width: "100%",
                            p: 1,
                            zIndex: theme => theme.zIndex.drawer,
                        }}
                    >
                        <ActionIconButton icon={<CloseIcon />} onClick={onClose} sx={{ alignSelf: "flex-start" }} />
                        {(isPublicPhoto || isPrivatePhoto) && (
                            <Box
                                sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mr: 2 }}
                            >
                                {isPublicPhoto && <PublicIcon sx={{ color: "primary.main" }} />}
                                {isPrivatePhoto && <PrivateIcon sx={{ color: "primary.main" }} />}
                            </Box>
                        )}
                    </Box>
                    {initialSlide !== null && (
                        <PhotoSwiper
                            photos={photos}
                            onSwiperSlideClick={onClose}
                            initialSlide={initialSlide}
                            onSlideChange={swiper => onSlideChange(swiper.realIndex)}
                        />
                    )}
                    {isOwner && (
                        <ProfilePhotoActions
                            photo={photo}
                            isPrivatePhoto={isPrivatePhoto}
                            isPublicPhoto={isPublicPhoto}
                        />
                    )}
                </Box>
            </Backdrop>
        );
    }
);
