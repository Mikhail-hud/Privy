import {
    PhotoUploadType,
    useGetProfileQuery,
    useUploadPhotoMutation,
    useDeleteProfilePhotoMutation,
} from "@app/core/services";
import Menu from "@mui/material/Menu";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import { enqueueSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import { QueryError } from "@app/core/interfaces";
import StarIcon from "@mui/icons-material/Star";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import NoPhotographyIcon from "@mui/icons-material/NoPhotography";
import { GENERIC_ERROR_MESSAGE } from "@app/core/constants/general";
import { FILE_PATTERN, FILE_SIZE } from "@app/core/constants/patterns";
import { ChangeEvent, FC, MouseEvent, RefObject, useState } from "react";

export const ProfileAvatar: FC = () => {
    const { data } = useGetProfileQuery();
    const [deletePhoto] = useDeleteProfilePhotoMutation();
    const [uploadPhoto, { isLoading: isUploading }] = useUploadPhotoMutation();

    const [isDeletingProfilePhoto, setIsDeletingProfilePhoto] = useState<boolean>(false);
    const [isDeletingIncognitoPhoto, setIsDeletingIncognitoPhoto] = useState<boolean>(false);

    const [backdropOpen, setBackdropOpen] = useState<boolean>(false);
    const [uploadType, setUploadType] = useState<PhotoUploadType>(PhotoUploadType.PROFILE);
    const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);

    const fileInputRef: RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);

    const isMenuOpen: boolean = Boolean(anchorEl);

    const handleMenuOpen = (event: MouseEvent<HTMLButtonElement>): void => setAnchorEl(event.currentTarget);

    const handleMenuClose = (): void => setAnchorEl(null);

    const handleUploadClick = (type: PhotoUploadType): void => {
        setUploadType(type);
        fileInputRef.current?.click();
        handleMenuClose();
    };

    const handleDeletePhoto = async (id: string | undefined | null, type: PhotoUploadType): Promise<void> => {
        if (!id) {
            return;
        }
        type === PhotoUploadType.PROFILE ? setIsDeletingProfilePhoto(true) : setIsDeletingIncognitoPhoto(true);
        try {
            await deletePhoto(id).unwrap();
            handleMenuClose();
        } catch (error) {
            const errorMessage: string = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
            enqueueSnackbar(errorMessage, { variant: "error" });
        } finally {
            type === PhotoUploadType.PROFILE ? setIsDeletingProfilePhoto(false) : setIsDeletingIncognitoPhoto(false);
        }
    };

    const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            const file: File = event.target.files[0];

            if (!FILE_PATTERN.test(file.type)) {
                enqueueSnackbar("Invalid file type. Allowed types: JPEG, PNG, GIF, WEBP, SVG.", { variant: "error" });
                if (event.target) event.target.value = "";
                return;
            }
            try {
                if (file.size > FILE_SIZE) {
                    enqueueSnackbar("File size must not exceed 15 MB", { variant: "error" });
                    return;
                }
                await uploadPhoto({ file, type: uploadType }).unwrap();
            } catch (error) {
                const errorMessage: string = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
                enqueueSnackbar(errorMessage, { variant: "error" });
            } finally {
                if (event.target) event.target.value = "";
            }
        }
    };

    return (
        <>
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                    <IconButton
                        onClick={handleMenuOpen}
                        color="primary"
                        size="small"
                        sx={theme => ({
                            width: 30,
                            height: 30,
                            border: "1px solid",
                            bgcolor: "background.paper",
                            "&:hover": {
                                backgroundColor: theme.palette.mode === "light" ? "grey.100" : "grey.800",
                            },
                        })}
                    >
                        <AddAPhotoIcon fontSize="inherit" />
                    </IconButton>
                }
            >
                {isUploading ? (
                    <Skeleton variant="circular" animation="pulse" width={100} height={100} />
                ) : (
                    <Avatar
                        alt="profile image"
                        src={data?.profilePhoto?.url}
                        onClick={() => setBackdropOpen(true)}
                        sx={{ width: 100, height: 100, cursor: "pointer" }}
                    >
                        {data?.userName?.charAt(0).toUpperCase() || "U"}
                    </Avatar>
                )}
            </Badge>
            <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
                <MenuItem onClick={() => handleUploadClick(PhotoUploadType.PROFILE)}>
                    <ListItemIcon>
                        <StarIcon fontSize="small" />
                    </ListItemIcon>
                    Upload new Profile photo
                </MenuItem>
                <MenuItem onClick={() => handleUploadClick(PhotoUploadType.INCOGNITO)}>
                    <ListItemIcon>
                        <NoPhotographyIcon fontSize="small" />
                    </ListItemIcon>
                    Upload new Incognito photo
                </MenuItem>
                {data?.profilePhoto && (
                    <MenuItem
                        sx={{ color: "error.main" }}
                        disabled={isDeletingProfilePhoto}
                        onClick={() => handleDeletePhoto(data?.profilePhoto?.id, PhotoUploadType.PROFILE)}
                    >
                        <ListItemIcon>
                            {isDeletingProfilePhoto ? (
                                <Skeleton variant="circular" animation="pulse" width={24} height={24} />
                            ) : (
                                <Avatar src={data?.profilePhoto?.url} sx={{ width: 24, height: 24 }} />
                            )}
                        </ListItemIcon>
                        Delete current Profile photo
                    </MenuItem>
                )}
                {data?.incognitoPhoto && (
                    <MenuItem
                        sx={{ color: "error.main" }}
                        disabled={isDeletingIncognitoPhoto}
                        onClick={() => handleDeletePhoto(data?.incognitoPhoto?.id, PhotoUploadType.INCOGNITO)}
                    >
                        <ListItemIcon>
                            {isDeletingIncognitoPhoto ? (
                                <Skeleton variant="circular" animation="pulse" width={24} height={24} />
                            ) : (
                                <Avatar src={data?.incognitoPhoto?.url} sx={{ width: 24, height: 24 }} />
                            )}
                        </ListItemIcon>
                        Delete current Incognito photo
                    </MenuItem>
                )}
            </Menu>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleAvatarChange}
                accept="image/png, image/jpeg, image/gif"
            />
            <Backdrop
                open={backdropOpen}
                onClick={() => setBackdropOpen(false)}
                sx={{ zIndex: theme => theme.zIndex.drawer + 1, background: "black" }}
            >
                {data?.profilePhoto?.url ? (
                    <img
                        alt="profile_image"
                        src={data?.profilePhoto?.url}
                        style={{ maxWidth: "80vw", maxHeight: "80vh", borderRadius: "15px" }}
                    />
                ) : (
                    <Avatar
                        alt="profile_image"
                        sx={{ width: "100%", height: "100%", maxWidth: "250px", maxHeight: "250px" }}
                    >
                        {data?.userName?.charAt(0).toUpperCase() || "U"}
                    </Avatar>
                )}
            </Backdrop>
        </>
    );
};
