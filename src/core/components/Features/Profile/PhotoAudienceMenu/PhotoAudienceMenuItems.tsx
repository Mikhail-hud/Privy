import { ReactElement } from "react";
import MenuItem from "@mui/material/MenuItem";
import CheckIcon from "@mui/icons-material/Check";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Photo, PhotoAudience } from "@app/core/services";
import CircularProgress from "@mui/material/CircularProgress";

export const PHOTO_AUDIENCE_LABELS: Record<PhotoAudience, string> = {
    [PhotoAudience.REAL]: "Public profile only",
    [PhotoAudience.INCOGNITO]: "Incognito only",
    [PhotoAudience.BOTH]: "Both profiles",
};

export const PHOTO_AUDIENCE_ORDER: PhotoAudience[] = [PhotoAudience.REAL, PhotoAudience.INCOGNITO, PhotoAudience.BOTH];

export interface AvatarSlots {
    isPublicAvatar: boolean;
    isIncognitoAvatar: boolean;
}

export const blockedReason = (
    audience: PhotoAudience,
    { isPublicAvatar, isIncognitoAvatar }: AvatarSlots
): string | null => {
    if (audience === PhotoAudience.INCOGNITO && isPublicAvatar) {
        return "Used as your public avatar";
    }
    if (audience === PhotoAudience.REAL && isIncognitoAvatar) {
        return "Used as your incognito avatar";
    }
    return null;
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
    isIncognitoAvatar,
}: PhotoAudienceMenuItemsProps): ReactElement[] => {
    return [
        ...PHOTO_AUDIENCE_ORDER.map((audience: PhotoAudience): ReactElement => {
            const isCurrent: boolean = photo?.audience === audience;
            const reason: string | null = blockedReason(audience, { isPublicAvatar, isIncognitoAvatar });

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
