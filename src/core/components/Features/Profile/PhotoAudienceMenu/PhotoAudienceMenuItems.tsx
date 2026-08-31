import { ReactElement } from "react";
import MenuItem from "@mui/material/MenuItem";
import CheckIcon from "@mui/icons-material/Check";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Photo, PhotoAudience } from "@app/core/services";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

export const PHOTO_AUDIENCE_LABELS: Record<PhotoAudience, string> = {
    [PhotoAudience.PUBLIC]: "Public profile only",
    [PhotoAudience.PRIVATE]: "Incognito profile only",
    [PhotoAudience.BOTH]: "Both profiles",
};

export const PHOTO_AUDIENCE_ORDER: PhotoAudience[] = [PhotoAudience.PUBLIC, PhotoAudience.PRIVATE, PhotoAudience.BOTH];

export interface AvatarSlots {
    isPublicAvatar: boolean;
    isPrivateAvatar: boolean;
}

export const blockedReason = (
    audience: PhotoAudience,
    { isPublicAvatar, isPrivateAvatar }: AvatarSlots
): string | null => {
    if (audience === PhotoAudience.PRIVATE && isPublicAvatar) {
        return "Used as your public avatar";
    }
    if (audience === PhotoAudience.PUBLIC && isPrivateAvatar) {
        return "Used as your incognito avatar";
    }
    return null;
};

const widenNote = (photo: Photo | null): ReactElement[] => {
    if (!photo || photo.audience === PhotoAudience.BOTH) return [];

    return [
        <Typography key="widen-note" color="primary" variant="inherit" sx={{ mb: 0.5, px: 2 }}>
            Setting this photo as an avatar adds that profile here. It never removes one.
        </Typography>,
    ];
};

interface PhotoAudienceMenuItemsProps extends AvatarSlots {
    photo: Photo | null;
    isLoading: boolean;
    onSelect: (audience: PhotoAudience) => () => Promise<void>;
}

export const PhotoAudienceMenuItems = ({
    photo,
    isLoading,
    onSelect,
    isPublicAvatar,
    isPrivateAvatar,
}: PhotoAudienceMenuItemsProps): ReactElement[] => {
    return [
        ...widenNote(photo),
        ...PHOTO_AUDIENCE_ORDER.map((audience: PhotoAudience): ReactElement => {
            const isCurrent: boolean = photo?.audience === audience;
            const reason: string | null = blockedReason(audience, { isPublicAvatar, isPrivateAvatar });

            return (
                <MenuItem
                    key={audience}
                    selected={isCurrent}
                    disabled={isLoading || isCurrent || Boolean(reason)}
                    onClick={onSelect(audience)}
                >
                    <ListItemIcon>
                        {isCurrent && <CheckIcon fontSize="small" />}
                        {isLoading && !isCurrent && <CircularProgress size={16} color="inherit" />}
                    </ListItemIcon>
                    <ListItemText primary={PHOTO_AUDIENCE_LABELS[audience]} secondary={reason} />
                </MenuItem>
            );
        }),
    ];
};
