import { FC } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Photo, Profile } from "@app/core/services";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemIcon from "@mui/material/ListItemIcon";
import DownloadIcon from "@mui/icons-material/Download";
import { useProfileActions } from "@app/core/components";
import CircularProgress from "@mui/material/CircularProgress";
import { PublicIcon, PrivateIcon } from "@app/core/assets/icons";

interface PhotoActionsMenuProps {
    profile: Profile;
    anchorEl: HTMLElement | null;
    handleClose: () => void;
    photo: Photo | null;
}

export const PhotoActionsMenu: FC<PhotoActionsMenuProps> = memo(({ photo, handleClose, anchorEl, profile }) => {
    const isPublicPhoto = profile?.publicPhoto?.id === photo?.id;
    const isPrivatePhoto = profile?.privatePhoto?.id === photo?.id;
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
        await deletePhoto(photo.id, handleClose);
    };

    const handleDownloadPhoto = (): void => {
        if (!photo) return;
        downloadPhoto(photo);
    };

    return (
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            {isPublicPhoto ? (
                <MenuItem onClick={handleUnsetPublicPhoto} disabled={isUnSettingAsPublic}>
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
                <MenuItem onClick={handleSetPhotoAsPublic} disabled={isSettingAsPublic}>
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
                <MenuItem onClick={handleUnsetPrivatePhoto} disabled={isUnSettingAsPrivate}>
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
                <MenuItem onClick={handleSetPhotoAsPrivate} disabled={isSettingAsPrivate}>
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
            <MenuItem onClick={handleDeletePhoto} sx={{ color: "error.main" }} disabled={isDeleting}>
                <ListItemIcon>
                    {isDeleting ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon fontSize="small" />}
                </ListItemIcon>
                Delete Photo
            </MenuItem>
        </Menu>
    );
});
