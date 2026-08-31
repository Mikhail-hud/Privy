import Menu from "@mui/material/Menu";
import { FC, MouseEvent, useState } from "react";
import { Photo, PhotoAudience } from "@app/core/services";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ActionIconButton, AvatarSlots, PhotoAudienceMenuItems } from "@app/core/components";

interface PhotoAudienceButtonProps extends AvatarSlots {
    photo: Photo | null;
    isLoading: boolean;
    onSelect: (audience: PhotoAudience) => () => Promise<void>;
}

export const PhotoAudienceButton: FC<PhotoAudienceButtonProps> = ({
    photo,
    isPublicAvatar,
    isIncognitoAvatar,
    onSelect,
    isLoading,
}) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleClose = (): void => setAnchorEl(null);
    const handleAnchorEl = (event: MouseEvent<HTMLElement>): void => setAnchorEl(event.currentTarget);

    return (
        <>
            <ActionIconButton
                label="Visibility"
                loading={isLoading}
                icon={<VisibilityIcon />}
                onClick={handleAnchorEl}
            />
            <Menu
                anchorOrigin={{
                    vertical: "center",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "center",
                    horizontal: "center",
                }}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{ zIndex: theme => theme.zIndex.drawer + 2 }}
            >
                <PhotoAudienceMenuItems
                    photo={photo}
                    isLoading={isLoading}
                    onSelect={onSelect}
                    isPublicAvatar={isPublicAvatar}
                    isIncognitoAvatar={isIncognitoAvatar}
                />
            </Menu>
        </>
    );
};
