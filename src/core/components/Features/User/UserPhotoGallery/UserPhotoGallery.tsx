import Box from "@mui/material/Box";
import { FC, MouseEvent } from "react";
import { Photo, Profile } from "@app/core/services";
import { PhotoActionsMenu } from "@app/core/components";
import { useInfiniteScrollTrigger } from "@app/core/hooks";
import { PhotoGrid } from "@app/core/components/Features/User/UserPhotoGallery/PhotoGrid";
import { PhotoViewer } from "@app/core/components/Features/User/UserPhotoGallery/PhotoViewer";

interface UserPhotoGalleryProps {
    profile: Profile;
    photos: Photo[];
    isOwner?: boolean;
    isLoading?: boolean;
    isFetching?: boolean;
    isFetchingNextPage?: boolean;
    hasNextPage?: boolean;
    fetchNextPage?: () => void;
}

export const UserPhotoGallery: FC<UserPhotoGalleryProps> = ({
    photos,
    profile,
    isOwner = false,
    isLoading = false,
    isFetching = false,
    isFetchingNextPage = false,
    hasNextPage = false,
    fetchNextPage,
}) => {
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
                setActivePhotoInViewer(photo);
                setSelectedImageIndex(index);
            },
        []
    );

    const handleMenuClose = useCallback((): void => {
        setAnchorEl(null);
        setPhoto(null);
    }, []);

    const handleCloseBackdrop = useCallback((_e: MouseEvent<HTMLElement>): void => {
        setSelectedImageIndex(null);
        setActivePhotoInViewer(null);
    }, []);

    const onSlideChange = useCallback(
        (currentSlideIndex: number): void => setActivePhotoInViewer(photos[currentSlideIndex] || null),
        [photos]
    );

    const loaderNodeRef = useInfiniteScrollTrigger({
        isLoading,
        isFetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        enabled: !!photos.length,
    });

    return (
        <>
            <PhotoGrid
                photos={photos}
                isOwner={isOwner}
                isLoading={isLoading}
                isFetchingNextPage={isFetchingNextPage}
                onImageClick={handleImageClick}
                onMenuOpen={handleMenuOpen}
            />
            {hasNextPage && <Box ref={loaderNodeRef} />}
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
