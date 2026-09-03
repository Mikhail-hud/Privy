import { FC } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListSubheader from "@mui/material/ListSubheader";
import DownloadIcon from "@mui/icons-material/Download";
import { Photo, PhotoAudience, PhotoSlots } from "@app/core/services";
import CircularProgress from "@mui/material/CircularProgress";
import { PublicIcon, PrivateIcon } from "@app/core/assets/icons";
import { useProfileActions, PhotoAudienceMenuItems } from "@app/core/components";

interface PhotoActionsMenuProps {
    photoSlots: PhotoSlots;
    anchorEl: HTMLElement | null;
    handleClose: () => void;
    photo: Photo | null;
}

export const PhotoActionsMenu: FC<PhotoActionsMenuProps> = memo(({ photo, handleClose, anchorEl, photoSlots }) => {
    const isPublicPhoto = photoSlots?.publicPhoto?.id === photo?.id;
    const isPrivatePhoto = photoSlots?.privatePhoto?.id === photo?.id;
    const {
        delete: { isLoading: isDeleting, handler: deletePhoto },
        setPublic: { isLoading: isSettingAsPublic, handler: setPhotoAsPublic },
        setPrivate: { isLoading: isSettingAsPrivate, handler: setPhotoAsPrivate },
        unsetPublic: { isLoading: isUnSettingAsPublic, handler: unsetPublicPhoto },
        unsetPrivate: { isLoading: isUnSettingAsPrivate, handler: unsetPrivatePhoto },
        setAudience: { isLoading: isSettingAudience, handler: setPhotoAudience },
        downloadPhoto,
    } = useProfileActions();

    const handleSetAudience = (audience: PhotoAudience) => async (): Promise<void> => {
        if (!photo) return;
        await setPhotoAudience({ photoId: photo.id, audience });
    };
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
                    Unset Incognito Profile Photo
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
                    Set as Incognito Profile Photo
                </MenuItem>
            )}
            <Divider />
            <ListSubheader sx={{ lineHeight: 2, color: "text.primary", fontWeight: 400, mb: 0.5 }}>
                Visible on:
            </ListSubheader>
            <PhotoAudienceMenuItems
                photo={photo}
                onSelect={handleSetAudience}
                isLoading={isSettingAudience}
                isPublicAvatar={isPublicPhoto}
                isPrivateAvatar={isPrivatePhoto}
            />
            <Divider />
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
