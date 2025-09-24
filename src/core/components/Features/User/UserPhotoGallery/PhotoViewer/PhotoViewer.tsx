import { FC } from "react";
import { Photo } from "@app/core/services";
import { Backdrop, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { PublicIcon, PrivateIcon } from "@app/core/assets/icons";
import { PhotoSwiper, ActionIconButton, ProfilePhotoActions } from "@app/core/components";

interface PhotoViewerProps {
    open: boolean;
    onClose: () => void;
    photo: Photo | null;
    photos: Photo[];
    initialSlide: number | null;
    onSlideChange: (index: number) => void;
    isOwner: boolean;
    isPublicPhoto: boolean;
    isPrivatePhoto: boolean;
}

export const PhotoViewer: FC<PhotoViewerProps> = ({
    open,
    onClose,
    photo,
    photos,
    initialSlide,
    onSlideChange,
    isOwner,
    isPublicPhoto,
    isPrivatePhoto,
}) => (
    <Backdrop sx={{ zIndex: theme => theme.zIndex.drawer + 1, background: "black" }} open={open}>
        <Box
            sx={{
                p: 2,
                gap: 2,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <ActionIconButton icon={<CloseIcon />} onClick={onClose} sx={{ alignSelf: "flex-start" }} />
                {(isPublicPhoto || isPrivatePhoto) && (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mr: 2 }}>
                        {isPublicPhoto && <PublicIcon sx={{ color: "primary.main" }} />}
                        {isPrivatePhoto && <PrivateIcon sx={{ color: "primary.main" }} />}
                    </Box>
                )}
            </Box>
            {initialSlide !== null && (
                <PhotoSwiper
                    photos={photos}
                    initialSlide={initialSlide}
                    onSlideChange={swiper => onSlideChange(swiper.realIndex)}
                />
            )}
            {isOwner && (
                <ProfilePhotoActions photo={photo} isPrivatePhoto={isPrivatePhoto} isPublicPhoto={isPublicPhoto} />
            )}
        </Box>
    </Backdrop>
);
