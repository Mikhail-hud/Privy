import React from "react";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { PhotoUploadType, Profile } from "@app/core/services";
import { ActionIconButton, Avatar } from "@app/core/components";
import { PrivateIcon, PublicIcon } from "@app/core/assets/icons";

interface AvatarBackdropContentProps {
    isOwner?: boolean;
    onClose: () => void;
    open: boolean;
    isUploading?: boolean;
    onUnsetPhoto: () => void;
    photoType: PhotoUploadType;
    profile: Profile;
    isUnSetting: boolean;
    onUnsetPhotoShown: boolean;
    isDeletingProfilePhoto: boolean;
    isDeletingIncognitoPhoto: boolean;
    onUploadClick: (type: PhotoUploadType) => () => void;
    onDeletePhoto: (id: string | undefined | null, type: PhotoUploadType) => () => void;
}

export const AvatarBackdrop: React.FC<AvatarBackdropContentProps> = ({
    profile,
    photoType,
    onClose,
    isUploading,
    onUploadClick,
    onDeletePhoto,
    onUnsetPhoto,
    isUnSetting,
    onUnsetPhotoShown,
    isDeletingProfilePhoto,
    isDeletingIncognitoPhoto,
    open,
    isOwner = false,
}) => {
    // TODO: Optimize re-renders
    const isPublicPhoto = photoType === PhotoUploadType.PUBLIC;
    const currentPhotoUrl = isPublicPhoto ? profile?.publicPhoto?.signedUrl : profile?.privatePhoto?.signedUrl;
    const currentPhotoId = isPublicPhoto ? profile?.publicPhoto?.id : profile?.privatePhoto?.id;
    const isDeleting = isPublicPhoto ? isDeletingProfilePhoto : isDeletingIncognitoPhoto;

    return (
        <Backdrop open={open} sx={{ zIndex: theme => theme.zIndex.drawer + 1, background: "black" }}>
            <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
                <Box sx={{ p: 2, width: "100%", display: "flex", justifyContent: "space-between" }}>
                    <ActionIconButton icon={<CloseIcon />} onClick={onClose} />
                    <Typography component="h1" variant="h3" color="white">
                        {isPublicPhoto ? "Public Photo" : "Private Photo"}
                    </Typography>
                </Box>
                <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {currentPhotoUrl ? (
                        <img
                            src={currentPhotoUrl}
                            alt={isPublicPhoto ? "public_photo" : "private_photo"}
                            style={{ maxWidth: "80vw", maxHeight: "80vh", borderRadius: "2px" }}
                        />
                    ) : (
                        <Avatar
                            loading={isUploading}
                            src={currentPhotoUrl}
                            userName={profile?.userName}
                            sx={{ width: 250, height: 250 }}
                            skeleton={{ width: 250, height: 250 }}
                            alt={isPublicPhoto ? "public_photo" : "private_photo"}
                        />
                    )}
                </Box>
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
                            label="Upload"
                            loading={isUploading}
                            icon={<AddAPhotoIcon />}
                            onClick={onUploadClick(photoType)}
                        />
                        {onUnsetPhotoShown && (
                            <ActionIconButton
                                onClick={onUnsetPhoto}
                                loading={isUnSetting}
                                icon={isPublicPhoto ? <PublicIcon /> : <PrivateIcon />}
                                label={isPublicPhoto ? "Unset Public" : "Unset Private"}
                            />
                        )}
                        {currentPhotoId && (
                            <ActionIconButton
                                label="Delete"
                                loading={isDeleting}
                                icon={<DeleteIcon />}
                                sx={{ color: "error.main" }}
                                onClick={onDeletePhoto(currentPhotoId, photoType)}
                            />
                        )}
                    </Box>
                )}
            </Box>
        </Backdrop>
    );
};
