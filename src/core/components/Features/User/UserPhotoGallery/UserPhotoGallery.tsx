import Box from "@mui/material/Box";
import { FC, MouseEvent, WheelEventHandler } from "react";
import { Photo, Profile } from "@app/core/services";
import { PhotoActionsMenu } from "@app/core/components";
import { useInfiniteScrollTrigger } from "@app/core/hooks";
import { PhotoGrid } from "@app/core/components/Features/User/UserPhotoGallery/PhotoGrid";
import { PhotoViewer } from "@app/core/components/Features/User/UserPhotoGallery/PhotoViewer";
import { EmptyGalleryFallback } from "@app/core/components/Features/User/UserPhotoGallery/EmptyGalleryFallback";
interface UserPhotoGalleryProps {
    profile: Profile;
    photos: Photo[];
    isOwner?: boolean;
    isLoading?: boolean;
    isFetching?: boolean;
    isFetchingNextPage?: boolean;
    hasNextPage?: boolean;
    fetchNextPage?: () => void;
    onUploadClick?: () => void;
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
    onUploadClick,
}) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
    const [photoId, setPhotoId] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const photo: Photo | null = useMemo(
        () => photos.find(candidate => candidate.id === photoId) ?? null,
        [photos, photoId]
    );

    const activePhotoInViewer: Photo | null = useMemo(
        () => (activePhotoIndex !== null ? (photos[activePhotoIndex] ?? null) : null),
        [photos, activePhotoIndex]
    );

    const handleMenuOpen = useCallback(
        (photo: Photo) =>
            (event: MouseEvent<HTMLElement>): void => {
                setPhotoId(photo.id);
                setAnchorEl(event.currentTarget);
            },
        []
    );

    const handleImageClick = useCallback(
        (index: number, _photo: Photo) =>
            (_event: MouseEvent<HTMLImageElement>): void => {
                setSelectedImageIndex(index);
                setActivePhotoIndex(index);
            },
        []
    );

    const handleMenuClose = useCallback((): void => {
        setAnchorEl(null);
        setPhotoId(null);
    }, []);

    const handleCloseBackdrop = useCallback(
        (_e: MouseEvent<HTMLElement> | WheelEventHandler<HTMLDivElement> | undefined): void => {
            setSelectedImageIndex(null);
            setActivePhotoIndex(null);
        },
        []
    );

    const onSlideChange = useCallback((currentSlideIndex: number): void => setActivePhotoIndex(currentSlideIndex), []);

    const loaderNodeRef = useInfiniteScrollTrigger({
        isLoading,
        isFetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        enabled: !!photos.length,
    });

    const isEmpty: boolean = !isLoading && !photos.length;

    return (
        <>
            {isEmpty ? (
                <EmptyGalleryFallback isOwner={isOwner} onUploadClick={onUploadClick} />
            ) : (
                <PhotoGrid
                    photos={photos}
                    isOwner={isOwner}
                    isLoading={isLoading}
                    isFetchingNextPage={isFetchingNextPage}
                    onImageClick={handleImageClick}
                    onMenuOpen={handleMenuOpen}
                />
            )}
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
