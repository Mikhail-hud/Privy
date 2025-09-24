import { FC } from "react";
import Menu from "@mui/material/Menu";
import { Photo } from "@app/core/services";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemIcon from "@mui/material/ListItemIcon";
import DownloadIcon from "@mui/icons-material/Download";
import { useProfileActions } from "@app/core/components";
import CircularProgress from "@mui/material/CircularProgress";
import { PublicIcon, PrivateIcon } from "@app/core/assets/icons";

interface ProfileMenuPhotoActionsProps {
    anchorEl: HTMLElement | null;
    handleMenuClose: () => void;
    isPublicPhoto: boolean;
    isPrivatePhoto: boolean;
    photo: Photo | null;
}

export const ProfileMenuPhotoActions: FC<ProfileMenuPhotoActionsProps> = ({
    isPrivatePhoto,
    isPublicPhoto,
    photo,
    handleMenuClose,
    anchorEl,
}) => {
    const {
        delete: { isLoading: isDeleting, handler: deletePhoto },
        setPublic: { isLoading: isSettingAsPublic, handler: setPhotoAsPublic },
        setPrivate: { isLoading: isSettingAsPrivate, handler: setPhotoAsPrivate },
        unsetPublic: { isLoading: isUnSettingAsPublic, handler: unsetPublicPhoto },
        unsetPrivate: { isLoading: isUnSettingAsPrivate, handler: unsetPrivatePhoto },
        downloadPhoto,
    } = useProfileActions();

    const handleSetPhotoAsPublic = async (): Promise<void> => {
        if (!photo) return;
        await setPhotoAsPublic(photo.id);
    };
    const handleSetPhotoAsPrivate = async (): Promise<void> => {
        if (!photo) return;
        await setPhotoAsPrivate(photo.id);
    };

    const handleUnsetPublicPhoto = async (): Promise<void> => await unsetPublicPhoto();
    const handleUnsetPrivatePhoto = async (): Promise<void> => await unsetPrivatePhoto();

    const handleDeletePhoto = async (): Promise<void> => {
        if (!photo) return;
        await deletePhoto(photo.id, handleMenuClose);
    };

    const handleDownloadPhoto = async (): Promise<void> => {
        if (!photo) return;
        await downloadPhoto(photo);
    };

    return (
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
                        {isSettingAsPublic ? (
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
    );
};
