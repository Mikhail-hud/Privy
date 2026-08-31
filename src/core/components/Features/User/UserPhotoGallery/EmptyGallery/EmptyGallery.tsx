import { FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

interface EmptyGalleryProps {
    isOwner: boolean;
    onUploadClick?: () => void;
}

export const EmptyGallery: FC<EmptyGalleryProps> = ({ isOwner, onUploadClick }) => {
    return (
        <Box
            onClick={isOwner ? onUploadClick : undefined}
            sx={{
                mt: 1,
                display: "flex",
                gap: 0.5,
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                cursor: isOwner ? "pointer" : "default",
            }}
        >
            <AddPhotoAlternateIcon sx={{ fontSize: { xxs: 35, xs: 40, sm: 50 } }} color="primary" />
            <Typography color="primary" variant="subtitle1">
                No photos yet
            </Typography>
            {isOwner && (
                <Typography variant="body1" color="textPrimary">
                    Tap here to add your first photo
                </Typography>
            )}
        </Box>
    );
};
