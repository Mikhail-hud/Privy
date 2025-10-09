import { FC } from "react";
import Box from "@mui/material/Box";
import { Photo } from "@app/core/services";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { PublicIcon, PrivateIcon } from "@app/core/assets/icons";
import { ActionIconButton, useProfileActions } from "@app/core/components";

interface ProfilePhotoActionsProps {
    photo: Photo | null;
    isPublicPhoto: boolean;
    isPrivatePhoto: boolean;
}

export const ProfilePhotoActions: FC<ProfilePhotoActionsProps> = ({ isPublicPhoto, isPrivatePhoto, photo }) => {
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
        await deletePhoto(photo.id);
    };

    const handleDownloadPhoto = (): void => {
        if (!photo) return;
        downloadPhoto(photo);
    };

    return (
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
            <ActionIconButton label="Download" onClick={handleDownloadPhoto} icon={<DownloadIcon fontSize="small" />} />
            <ActionIconButton
                label="Delete"
                loading={isDeleting}
                icon={<DeleteIcon />}
                onClick={handleDeletePhoto}
                sx={{ color: "error.main" }}
            />
        </Box>
    );
};
