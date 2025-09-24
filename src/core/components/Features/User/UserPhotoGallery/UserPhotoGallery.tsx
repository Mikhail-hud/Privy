import { FC, MouseEvent } from "react";
import { Photo, Profile } from "@app/core/services";
import { ProfileMenuPhotoActions } from "@app/core/components";
import { PhotoGrid } from "@app/core/components/Features/User/UserPhotoGallery/PhotoGrid";
import { PhotoViewer } from "@app/core/components/Features/User/UserPhotoGallery/PhotoViewer";

interface UserPhotoGalleryProps {
    profile: Profile | undefined;
    photos: Photo[];
    isOwner?: boolean;
}

export const UserPhotoGallery: FC<UserPhotoGalleryProps> = ({ photos, profile, isOwner = false }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [photo, setPhoto] = useState<Photo | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const isPublicPhoto = profile?.publicPhoto?.id === photo?.id;
    const isPrivatePhoto = profile?.privatePhoto?.id === photo?.id;

    const handleMenuOpen = useCallback(
        (photo: Photo) =>
            (event: MouseEvent<HTMLElement>): void => {
                setPhoto(photo);
                setAnchorEl(event.currentTarget);
            },
        []
    );

    const handleImageClick = useCallback(
        (index: number, photo: Photo) =>
            (_event: MouseEvent<HTMLImageElement>): void => {
                document.body.style.overflow = "hidden";
                setPhoto(photo);
                setSelectedImageIndex(index);
            },
        []
    );

    const handleMenuClose = (): void => {
        setAnchorEl(null);
        setPhoto(null);
    };

    const handleCloseBackdrop = (): void => {
        document.body.style.overflow = "unset";
        setSelectedImageIndex(null);
        setPhoto(null);
    };

    const onSlideChange = (currentSlideIndex: number): void => setPhoto(photos[currentSlideIndex] || null);

    return (
        <>
            <PhotoGrid photos={photos} isOwner={isOwner} onImageClick={handleImageClick} onMenuOpen={handleMenuOpen} />
            {isOwner && (
                <ProfileMenuPhotoActions
                    photo={photo}
                    anchorEl={anchorEl}
                    isPublicPhoto={isPublicPhoto}
                    isPrivatePhoto={isPrivatePhoto}
                    handleMenuClose={handleMenuClose}
                />
            )}
            <PhotoViewer
                photo={photo}
                photos={photos}
                isOwner={isOwner}
                isPublicPhoto={isPublicPhoto}
                isPrivatePhoto={isPrivatePhoto}
                initialSlide={selectedImageIndex}
                onSlideChange={onSlideChange}
                onClose={handleCloseBackdrop}
                open={selectedImageIndex !== null}
            />
        </>
    );
};
