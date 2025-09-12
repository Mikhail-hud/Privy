import {
    Photo,
    Profile,
    useSetPrivatePhotoMutation,
    useSetPublicPhotoMutation,
    useDeleteProfilePhotoMutation,
    useUnsetPublicPhotoMutation,
    useUnsetPrivatePhotoMutation,
} from "@app/core/services";
import { FC, MouseEvent } from "react";
import Menu from "@mui/material/Menu";
import Box from "@mui/material/Box";
import { enqueueSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import MenuItem from "@mui/material/MenuItem";
import ImageList from "@mui/material/ImageList";
import { useTheme } from "@app/core/providers";
import { alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import { QueryError } from "@app/core/interfaces";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { Theme, useMediaQuery } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import DownloadIcon from "@mui/icons-material/Download";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import CircularProgress from "@mui/material/CircularProgress";
import { PublicIcon, PrivateIcon } from "@app/core/assets/icons";
import { ActionIconButton, PhotoSwiper } from "@app/core/components";
import { GENERIC_ERROR_MESSAGE } from "@app/core/constants/general";

interface UserPhotoGalleryProps {
    profile: Profile | undefined;
    photos: Photo[];
    isOwner?: boolean;
}

export const UserPhotoGallery: FC<UserPhotoGalleryProps> = ({ photos = [], profile, isOwner = false }) => {
    const theme: Theme = useTheme();
    const isMobile: boolean = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet: boolean = useMediaQuery(theme.breakpoints.between("sm", "md"));

    const cols = useMemo(() => {
        if (isMobile) {
            return 1;
        }
        if (isTablet) {
            return 2;
        }
        return 3;
    }, [isMobile, isTablet]);

    const [deleteProfilePhoto, { isLoading: isDeleting }] = useDeleteProfilePhotoMutation();

    const [setPhotoAsPublic, { isLoading: isSettingAsPublic }] = useSetPublicPhotoMutation();
    const [setPhotoAsPrivate, { isLoading: isSettingAsPrivate }] = useSetPrivatePhotoMutation();

    const [unsetPrivatePhoto, { isLoading: isUnSettingAsPrivate }] = useUnsetPrivatePhotoMutation();
    const [unsetPublicPhoto, { isLoading: isUnSettingAsPublic }] = useUnsetPublicPhotoMutation();

    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [activePhotoId, setActivePhotoId] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const isPublicPhoto = profile?.publicPhoto?.id === activePhotoId;
    const isPrivatePhoto = profile?.privatePhoto?.id === activePhotoId;

    const handleMenuOpen = (event: MouseEvent<HTMLElement>, itemId: string): void => {
        setActivePhotoId(itemId);
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (): void => setAnchorEl(null);

    const handleDeletePhoto = async (): Promise<void> => {
        if (!activePhotoId || isDeleting) return;
        try {
            await deleteProfilePhoto(activePhotoId).unwrap();
            handleMenuClose();
        } catch (error) {
            const errorMessage: string = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    const handleSetPhotoAsPublic = async (): Promise<void> => {
        if (!activePhotoId || isSettingAsPublic) return;
        try {
            await setPhotoAsPublic(activePhotoId).unwrap();
        } catch (error) {
            const errorMessage: string = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };
    const handleSetPhotoAsPrivate = async (): Promise<void> => {
        if (!activePhotoId || isSettingAsPrivate) return;
        try {
            await setPhotoAsPrivate(activePhotoId).unwrap();
        } catch (error) {
            const errorMessage: string = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    const handleUnsetPublicPhoto = async (): Promise<void> => {
        if (!activePhotoId || isUnSettingAsPublic) return;
        try {
            await unsetPublicPhoto().unwrap();
        } catch (error) {
            const errorMessage: string = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };
    const handleUnsetPrivatePhoto = async (): Promise<void> => {
        if (!activePhotoId || isUnSettingAsPrivate) return;
        try {
            await unsetPrivatePhoto().unwrap();
        } catch (error) {
            const errorMessage: string = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };
    const handleDownloadPhoto = async (): Promise<void> => {
        if (!activePhotoId) return;
        const imageToDownload = photos.find(img => img.id === activePhotoId);
        if (!imageToDownload) return;
        try {
            const response = await fetch(imageToDownload.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", imageToDownload.key || "download.jpg");
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            enqueueSnackbar("Failed to download photo", { variant: "error" });
        }
    };

    const handleImageClick = (index: number, id: string): void => {
        document.body.style.overflow = "hidden";
        setActivePhotoId(id);
        setSelectedImageIndex(index);
    };

    const handleCloseBackdrop = (): void => {
        document.body.style.overflow = "unset";
        setSelectedImageIndex(null);
        setActivePhotoId(null);
    };

    const onSlideChange = (currentSlideIndex: number): void => setActivePhotoId(photos[currentSlideIndex]?.id || null);

    return (
        <>
            <ImageList cols={cols} gap={8} variant="masonry">
                {photos.map((item, index) => (
                    <ImageListItem key={item.id}>
                        <img
                            srcSet={`${item.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            src={`${item.url}?w=248&fit=crop&auto=format`}
                            alt={item.url}
                            loading="lazy"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleImageClick(index, item.id)}
                        />
                        <ImageListItemBar
                            position="top"
                            sx={{ background: "transparent" }}
                            actionIcon={
                                isOwner && (
                                    <Box
                                        sx={{
                                            alignItems: "center",
                                            display: "flex",
                                            width: "100%",
                                            gap: 1,
                                            mr: 1,
                                        }}
                                    >
                                        <ActionIconButton
                                            icon={<EditIcon />}
                                            sx={theme => ({
                                                color: theme.palette.common.white,
                                                backgroundColor: alpha(theme.palette.common.black, 0.2),
                                                "&:hover": {
                                                    backgroundColor: alpha(theme.palette.common.black, 0.4),
                                                },
                                            })}
                                            onClick={e => handleMenuOpen(e, item.id)}
                                        />
                                    </Box>
                                )
                            }
                            actionPosition="right"
                        />
                    </ImageListItem>
                ))}
            </ImageList>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                {isPublicPhoto ? (
                    <MenuItem onClick={handleUnsetPublicPhoto}>
                        <ListItemIcon>
                            {isUnSettingAsPublic ? (
                                <CircularProgress size={16} color="inherit" />
                            ) : (
                                <PublicIcon fontSize="small" />
                            )}
                        </ListItemIcon>
                        Unset Public Profile Photo
                    </MenuItem>
                ) : (
                    <MenuItem onClick={handleSetPhotoAsPublic}>
                        <ListItemIcon>
                            {isUnSettingAsPublic ? (
                                <CircularProgress size={16} color="inherit" />
                            ) : (
                                <PublicIcon fontSize="small" />
                            )}
                        </ListItemIcon>
                        Set as Public Profile Photo
                    </MenuItem>
                )}

                {isPrivatePhoto ? (
                    <MenuItem onClick={handleUnsetPrivatePhoto}>
                        <ListItemIcon>
                            {isUnSettingAsPrivate ? (
                                <CircularProgress size={16} color="inherit" />
                            ) : (
                                <PrivateIcon fontSize="small" />
                            )}
                        </ListItemIcon>
                        Unset Private Profile Photo
                    </MenuItem>
                ) : (
                    <MenuItem onClick={handleSetPhotoAsPrivate}>
                        <ListItemIcon>
                            {isSettingAsPrivate ? (
                                <CircularProgress size={16} color="inherit" />
                            ) : (
                                <PrivateIcon fontSize="small" />
                            )}
                        </ListItemIcon>
                        Set as Private Profile Photo
                    </MenuItem>
                )}
                <MenuItem onClick={handleDownloadPhoto}>
                    <ListItemIcon>
                        <DownloadIcon fontSize="small" />
                    </ListItemIcon>
                    Download
                </MenuItem>
                <MenuItem onClick={handleDeletePhoto} sx={{ color: "error.main" }}>
                    <ListItemIcon>
                        {isDeleting ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon fontSize="small" />}
                    </ListItemIcon>
                    Delete Photo
                </MenuItem>
            </Menu>
            <Backdrop
                sx={{ zIndex: theme => theme.zIndex.drawer + 1, background: "black" }}
                open={selectedImageIndex !== null}
            >
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
                        <ActionIconButton
                            icon={<CloseIcon />}
                            onClick={handleCloseBackdrop}
                            sx={{ alignSelf: "flex-start" }}
                        />
                        {(isPublicPhoto || isPrivatePhoto) && (
                            <Box
                                sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mr: 2 }}
                            >
                                {isPublicPhoto && <PublicIcon sx={{ color: "primary.main" }} />}
                                {isPrivatePhoto && <PrivateIcon sx={{ color: "primary.main" }} />}
                            </Box>
                        )}
                    </Box>
                    {selectedImageIndex !== null && (
                        <PhotoSwiper
                            photos={photos}
                            initialSlide={selectedImageIndex}
                            onSlideChange={swiper => onSlideChange(swiper.realIndex)}
                        />
                    )}
                    {isOwner && (
                        <Box
                            sx={{
                                gap: 2,
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <ActionIconButton
                                icon={<PublicIcon />}
                                loading={isSettingAsPublic || isUnSettingAsPublic}
                                label={isPublicPhoto ? "Unset Public" : "Set Public"}
                                onClick={isPublicPhoto ? handleUnsetPublicPhoto : handleSetPhotoAsPublic}
                            />
                            <ActionIconButton
                                icon={<PrivateIcon />}
                                loading={isSettingAsPrivate || isUnSettingAsPrivate}
                                label={isPrivatePhoto ? "Unset Private" : "Set Private"}
                                onClick={isPrivatePhoto ? handleUnsetPrivatePhoto : handleSetPhotoAsPrivate}
                            />
                            <ActionIconButton
                                loading={isDeleting}
                                label="Delete"
                                icon={<DeleteIcon />}
                                sx={{ color: "error.main" }}
                                onClick={handleDeletePhoto}
                            />
                        </Box>
                    )}
                </Box>
            </Backdrop>
        </>
    );
};
