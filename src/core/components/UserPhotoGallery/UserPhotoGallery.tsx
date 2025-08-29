import {
    Photo,
    Profile,
    useSetIncognitoPhotoMutation,
    useDeleteProfilePhotoMutation,
    useSetProfilePhotoToActiveMutation,
} from "@app/core/services";
import Slider from "react-slick";
import { FC, MouseEvent } from "react";
import Menu from "@mui/material/Menu";
import Box from "@mui/material/Box";
import { enqueueSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import MenuItem from "@mui/material/MenuItem";
import ImageList from "@mui/material/ImageList";
import { brand, useTheme } from "@app/core/providers";
import StarIcon from "@mui/icons-material/Star";
import { alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import { QueryError } from "@app/core/interfaces";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { Theme, useMediaQuery } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import DownloadIcon from "@mui/icons-material/Download";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import NoPhotographyIcon from "@mui/icons-material/NoPhotography";
import { GENERIC_ERROR_MESSAGE } from "@app/core/constants/general";

const settings = {
    dots: true,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false,
};

interface UserPhotoGalleryProps {
    profile: Profile | undefined;
    photos: Photo[];
}

export const UserPhotoGallery: FC<UserPhotoGalleryProps> = ({ photos = [], profile }) => {
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

    const [deleteProfilePhoto] = useDeleteProfilePhotoMutation();
    const [setPhotoToActive] = useSetProfilePhotoToActiveMutation();

    const [setPhotoAsIncognito] = useSetIncognitoPhotoMutation();

    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    const [menuState, setMenuState] = useState<{ anchorEl: HTMLElement | null; itemId: string | null }>({
        anchorEl: null,
        itemId: null,
    });

    const handleMenuOpen = (event: MouseEvent<HTMLElement>, itemId: string): void =>
        setMenuState({
            anchorEl: event.currentTarget,
            itemId,
        });

    const handleMenuClose = (): void => setMenuState({ anchorEl: null, itemId: null });

    const handleDeletePhoto = async (): Promise<void> => {
        if (!menuState.itemId) return;
        try {
            await deleteProfilePhoto(menuState.itemId).unwrap();
            handleMenuClose();
        } catch (error) {
            const errorMessage: string = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    const handleSetPhotoToActive = async (): Promise<void> => {
        if (!menuState.itemId) return;
        try {
            await setPhotoToActive(menuState.itemId).unwrap();
            handleMenuClose();
        } catch (error) {
            const errorMessage: string = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };
    const handleSetPhotoAsIncognito = async (): Promise<void> => {
        if (!menuState.itemId) return;
        try {
            await setPhotoAsIncognito(menuState.itemId).unwrap();
            handleMenuClose();
        } catch (error) {
            const errorMessage: string = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };
    const handleDownloadPhoto = async (): Promise<void> => {
        if (!menuState.itemId) return;
        const imageToDownload = photos.find(img => img.id === menuState.itemId);
        if (!imageToDownload) return;

        handleMenuClose();

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

    const handleImageClick = (index: number): void => {
        document.body.style.overflow = "hidden";
        setSelectedImageIndex(index);
    };

    const handleCloseBackdrop = (): void => {
        document.body.style.overflow = "unset";
        setSelectedImageIndex(null);
    };

    return (
        <>
            <ImageList cols={cols}>
                {photos.map((item, index) => (
                    <ImageListItem key={item.id}>
                        <img
                            loading="lazy"
                            alt={item.key}
                            src={item.url}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleImageClick(index)}
                        />
                        я
                        <ImageListItemBar
                            position="top"
                            sx={{ background: theme => alpha(theme.palette.common.black, 0.1) }}
                            actionIcon={
                                <Box
                                    sx={{
                                        alignItems: "center",
                                        display: "flex",
                                        width: "100%",
                                        gap: 1,
                                        mr: 1,
                                    }}
                                >
                                    {profile?.profilePhoto?.id === item.id && <StarIcon sx={{ color: brand[200] }} />}
                                    {profile?.incognitoPhoto?.id === item.id && (
                                        <NoPhotographyIcon sx={{ color: brand[200] }} />
                                    )}
                                    <IconButton
                                        sx={theme => ({
                                            color: theme.palette.common.white,
                                            backgroundColor: alpha(theme.palette.common.black, 0.3),
                                            "&:hover": {
                                                backgroundColor: alpha(theme.palette.common.black, 0.5),
                                            },
                                        })}
                                        onClick={e => handleMenuOpen(e, item.id)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Box>
                            }
                            actionPosition="right"
                        />
                    </ImageListItem>
                ))}
            </ImageList>
            <Menu anchorEl={menuState.anchorEl} open={Boolean(menuState.anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleSetPhotoToActive} disabled={profile?.profilePhoto?.id === menuState.itemId}>
                    <ListItemIcon>
                        <StarIcon fontSize="small" />
                    </ListItemIcon>
                    Set as Profile
                </MenuItem>
                <MenuItem
                    onClick={handleSetPhotoAsIncognito}
                    disabled={profile?.incognitoPhoto?.id === menuState.itemId}
                >
                    <ListItemIcon>
                        <NoPhotographyIcon fontSize="small" />
                    </ListItemIcon>
                    Set as Incognito
                </MenuItem>
                <MenuItem onClick={handleDownloadPhoto}>
                    <ListItemIcon>
                        <DownloadIcon fontSize="small" />
                    </ListItemIcon>
                    Download
                </MenuItem>
                <MenuItem onClick={handleDeletePhoto} sx={{ color: "error.main" }}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" sx={{ color: "error.main" }} />
                    </ListItemIcon>
                    Delete Photo
                </MenuItem>
            </Menu>
            <Backdrop
                sx={{ zIndex: theme => theme.zIndex.drawer + 1, background: "black" }}
                open={selectedImageIndex !== null}
            >
                <IconButton
                    onClick={handleCloseBackdrop}
                    sx={{ position: "absolute", top: 16, left: 16, color: theme => theme.palette.common.white }}
                >
                    <CloseIcon />
                </IconButton>
                {selectedImageIndex !== null && (
                    <Box
                        sx={theme => ({
                            width: "100vw",
                            ".slick-dots li button:before": {
                                color: theme.palette.common.white,
                                fontSize: "10px",
                            },
                            ".slick-dots li.slick-active button:before": {
                                color: theme.palette.common.white,
                            },

                            ".slick-prev, .slick-next": {
                                zIndex: 1,
                                width: 48,
                                height: 48,
                                borderRadius: "50%",
                                backgroundColor: alpha(theme.palette.common.black, 0.3),
                                "&:hover": {
                                    backgroundColor: alpha(theme.palette.common.black, 0.5),
                                },
                            },
                            ".slick-prev": {
                                left: "15px",
                            },
                            ".slick-next": {
                                right: "25px",
                            },
                            ".slick-prev:before, .slick-next:before": {
                                fontSize: "24px",
                                color: theme.palette.common.white,
                            },
                        })}
                    >
                        <Slider {...settings} initialSlide={selectedImageIndex}>
                            {photos.map(item => (
                                <Box
                                    key={item.id}
                                    sx={{
                                        height: "90vh !important",
                                        display: "flex !important",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <img
                                        src={item.url}
                                        alt={item.key}
                                        style={{
                                            maxWidth: "90vw",
                                            maxHeight: "90vh",
                                            objectFit: "scale-down",
                                        }}
                                    />
                                </Box>
                            ))}
                        </Slider>
                    </Box>
                )}
            </Backdrop>
        </>
    );
};
