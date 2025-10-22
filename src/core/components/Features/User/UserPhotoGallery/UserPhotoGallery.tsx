import { FC, MouseEvent } from "react";
import { Photo, Profile } from "@app/core/services";
import { PhotoActionsMenu } from "@app/core/components";
import { PhotoGrid } from "@app/core/components/Features/User/UserPhotoGallery/PhotoGrid";
import { PhotoViewer } from "@app/core/components/Features/User/UserPhotoGallery/PhotoViewer";

interface UserPhotoGalleryProps {
    profile: Profile;
    photos: Photo[];
    isOwner?: boolean;
}

export const UserPhotoGallery: FC<UserPhotoGalleryProps> = ({ photos, profile, isOwner = false }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [photo, setPhoto] = useState<Photo | null>(null);
    const [activePhotoInViewer, setActivePhotoInViewer] = useState<Photo | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

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
                setActivePhotoInViewer(photo);
                setSelectedImageIndex(index);
            },
        []
    );

    const handleMenuClose = useCallback((): void => {
        setAnchorEl(null);
        setPhoto(null);
    }, []);

    const handleCloseBackdrop = useCallback((): void => {
        document.body.style.overflow = "unset";
        setSelectedImageIndex(null);
        setActivePhotoInViewer(null);
    }, []);

    const onSlideChange = useCallback(
        (currentSlideIndex: number): void => setActivePhotoInViewer(photos[currentSlideIndex] || null),
        [photos]
    );

    return (
        <>
            <PhotoGrid photos={photos} isOwner={isOwner} onImageClick={handleImageClick} onMenuOpen={handleMenuOpen} />
            {isOwner && (
                <PhotoActionsMenu photo={photo} profile={profile} anchorEl={anchorEl} handleClose={handleMenuClose} />
            )}
            <PhotoViewer
                photos={photos}
                profile={profile}
                isOwner={isOwner}
                photo={activePhotoInViewer}
                onClose={handleCloseBackdrop}
                onSlideChange={onSlideChange}
                initialSlide={selectedImageIndex}
                open={selectedImageIndex !== null}
            />
        </>
    );
};
