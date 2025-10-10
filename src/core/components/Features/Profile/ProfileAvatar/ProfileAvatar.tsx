import {
    User,
    PhotoUploadType,
    useUploadPhotoMutation,
    useUnsetPublicPhotoMutation,
    useUnsetPrivatePhotoMutation,
    useDeleteProfilePhotoMutation,
} from "@app/core/services";
import Badge from "@mui/material/Badge";
import { enqueueSnackbar } from "notistack";
import { Avatar } from "@app/core/components";
import { QueryError } from "@app/core/interfaces";
import { ChangeEvent, FC, RefObject, useState } from "react";
import { GENERIC_ERROR_MESSAGE } from "@app/core/constants/general";
import { FILE_PATTERN, FILE_SIZE } from "@app/core/constants/patterns";
import { AvatarBackdrop } from "@app/core/components/Features/Profile/ProfileAvatar/AvatarBackdrop";

interface ProfileAvatarProps {
    profile: User | undefined;
    isOwner?: boolean;
}

export const ProfileAvatar: FC<ProfileAvatarProps> = ({ profile, isOwner = false }) => {
    // TODO: refactor to avoid re-renders
    const [deletePhoto] = useDeleteProfilePhotoMutation();
    const [uploadPhoto] = useUploadPhotoMutation();

    const [isDeletingPublicPhoto, setIsDeletingPublicPhoto] = useState<boolean>(false);
    const [isDeletingPrivatePhoto, setIsDeletingPrivatePhoto] = useState<boolean>(false);

    const [publicBackdropOpen, sePublicBackdropOpen] = useState<boolean>(false);
    const [privateBackdropOpen, setPrivateBackdropOpen] = useState<boolean>(false);

    const [isUploadingPublicPhoto, setIsUploadingPublicPhoto] = useState<boolean>(false);
    const [isUploadingPrivatePhoto, setIsUploadingPrivatePhoto] = useState<boolean>(false);

    const [unsetPrivatePhoto, { isLoading: isUnSettingPrivatePhoto }] = useUnsetPrivatePhotoMutation();
    const [unsetPublicPhoto, { isLoading: isUnSettingPublicPhoto }] = useUnsetPublicPhotoMutation();

    const [uploadType, setUploadType] = useState<PhotoUploadType>(PhotoUploadType.PUBLIC);

    const fileInputRef: RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);

    const handleUploadClick = (type: PhotoUploadType) => (): void => {
        setUploadType(type);
        fileInputRef.current?.click();
    };

    const onAvatarClick = (type: PhotoUploadType) => (): void => {
        if (type === PhotoUploadType.PRIVATE) {
            setPrivateBackdropOpen(true);
            return;
        }
        sePublicBackdropOpen(true);
    };

    const onClose = (type: PhotoUploadType) => (): void => {
        if (type === PhotoUploadType.PUBLIC) {
            sePublicBackdropOpen(false);
            return;
        }
        setPrivateBackdropOpen(false);
    };

    const handleDeletePhoto = (id: string | undefined | null, type: PhotoUploadType) => async (): Promise<void> => {
        if (!id) {
            return;
        }
        if (type === PhotoUploadType.PUBLIC) {
            setIsDeletingPublicPhoto(true);
        } else {
            setIsDeletingPrivatePhoto(true);
        }
        try {
            await deletePhoto(id).unwrap();
        } catch (error) {
            const errorMessage: string = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
            enqueueSnackbar(errorMessage, { variant: "error" });
        } finally {
            if (type === PhotoUploadType.PUBLIC) {
                setIsDeletingPublicPhoto(false);
            } else {
                setIsDeletingPrivatePhoto(false);
            }
        }
    };

    const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        if (event.target.files?.length) {
            if (uploadType === PhotoUploadType.PUBLIC) {
                setIsUploadingPublicPhoto(true);
            } else {
                setIsUploadingPrivatePhoto(true);
            }
            const file: File = event.target.files[0];

            if (!FILE_PATTERN.test(file.type)) {
                enqueueSnackbar("Invalid file type. Allowed types: JPEG, PNG, GIF, WEBP, SVG.", {
                    variant: "error",
                });
                if (event.target) event.target.value = "";

                if (uploadType === PhotoUploadType.PUBLIC) {
                    setIsUploadingPublicPhoto(false);
                } else {
                    setIsUploadingPrivatePhoto(false);
                }
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
                if (uploadType === PhotoUploadType.PUBLIC) {
                    setIsUploadingPublicPhoto(false);
                } else {
                    setIsUploadingPrivatePhoto(false);
                }
            }
        }
    };

    const handlUnsetPublicPhoto = async (): Promise<void> => {
        try {
            await unsetPublicPhoto().unwrap();
        } catch (error) {
            const errorMessage: string = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    const handleUnsetPrivatePhoto = async (): Promise<void> => {
        try {
            await unsetPrivatePhoto().unwrap();
        } catch (error) {
            const errorMessage: string = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    return (
        <>
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                    <Avatar
                        profile={profile}
                        alt="private_photo"
                        loading={isUploadingPrivatePhoto}
                        skeleton={{ width: 50, height: 50 }}
                        src={profile?.privatePhoto?.signedUrl}
                        onClick={onAvatarClick(PhotoUploadType.PRIVATE)}
                        sx={theme => ({
                            width: 50,
                            height: 50,
                            cursor: "pointer",
                            border: `2px solid ${theme.palette.background.paper}`,
                        })}
                    />
                }
            >
                <Avatar
                    profile={profile}
                    alt="public_photo"
                    loading={isUploadingPublicPhoto}
                    src={profile?.publicPhoto?.signedUrl}
                    skeleton={{ width: 120, height: 120 }}
                    onClick={onAvatarClick(PhotoUploadType.PUBLIC)}
                    sx={{ width: 120, height: 120, cursor: "pointer" }}
                />
            </Badge>
            <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleAvatarChange} />
            <AvatarBackdrop
                isOwner={isOwner}
                profile={profile}
                open={publicBackdropOpen}
                onUploadClick={handleUploadClick}
                onDeletePhoto={handleDeletePhoto}
                onUnsetPhoto={handlUnsetPublicPhoto}
                photoType={PhotoUploadType.PUBLIC}
                isUploading={isUploadingPublicPhoto}
                onClose={onClose(PhotoUploadType.PUBLIC)}
                onUnsetPhotoShown={!!profile?.publicPhoto?.id}
                isDeletingProfilePhoto={isDeletingPublicPhoto}
                isDeletingIncognitoPhoto={isDeletingPrivatePhoto}
                isUnSetting={isUnSettingPublicPhoto || isUnSettingPrivatePhoto}
            />
            <AvatarBackdrop
                isOwner={isOwner}
                profile={profile}
                open={privateBackdropOpen}
                onDeletePhoto={handleDeletePhoto}
                onUploadClick={handleUploadClick}
                onUnsetPhoto={handleUnsetPrivatePhoto}
                isUploading={isUploadingPrivatePhoto}
                photoType={PhotoUploadType.PRIVATE}
                onClose={onClose(PhotoUploadType.PRIVATE)}
                onUnsetPhotoShown={!!profile?.privatePhoto?.id}
                isDeletingProfilePhoto={isDeletingPublicPhoto}
                isDeletingIncognitoPhoto={isDeletingPrivatePhoto}
                isUnSetting={isUnSettingPublicPhoto || isUnSettingPrivatePhoto}
            />
        </>
    );
};
