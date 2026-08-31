import { FC } from "react";
import Box from "@mui/material/Box";
import { Photo, PhotoAudience } from "@app/core/services";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { PublicIcon, PrivateIcon } from "@app/core/assets/icons";
import { ActionIconButton, PhotoAudienceButton, useProfileActions } from "@app/core/components";

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
        setAudience: { isLoading: isSettingAudience, handler: setAudience },
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

    const handleChangeAudience = (audience: PhotoAudience) => async (): Promise<void> => {
        if (!photo) return;
        await setAudience({ photoId: photo.id, audience });
    };

    return (
        <Box
            sx={{
                gap: 2,
                bottom: 10,
                width: "100%",
                display: "flex",
                position: "fixed",
                justifyContent: "center",
                zIndex: theme => theme.zIndex.drawer + 1,
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
                label={isPrivatePhoto ? "Unset Incognito" : "Set Incognito"}
                onClick={isPrivatePhoto ? handleUnsetPrivatePhoto : handleSetPhotoAsPrivate}
            />
            <PhotoAudienceButton
                photo={photo}
                isLoading={isSettingAudience}
                isPublicAvatar={isPublicPhoto}
                onSelect={handleChangeAudience}
                isPrivateAvatar={isPrivatePhoto}
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
