import { ChangeEvent, FC, RefObject, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Radio from "@mui/material/Radio";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { enqueueSnackbar } from "notistack";
import RadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import { prepareImageForUpload } from "@app/core/utils/fileUtils.ts";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { PHOTO_AUDIENCE_LABELS, PHOTO_AUDIENCE_ORDER } from "@app/core/components";
import { ApiError, PhotoAudience, PhotoUploadType, useUploadPhotoMutation } from "@app/core/services";
import { useMediaQuery } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { useTheme } from "@app/core/providers";

const DEFAULT_AUDIENCE: PhotoAudience = PhotoAudience.REAL;

interface GalleryPhotoUploadProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const GalleryPhotoUpload: FC<GalleryPhotoUploadProps> = ({ open, onOpenChange }) => {
    const theme: Theme = useTheme();

    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [audience, setAudience] = useState<PhotoAudience>(DEFAULT_AUDIENCE);

    const isMobile: boolean = useMediaQuery(theme.breakpoints.between("xs", "sm"));
    const isLegacyMobile: boolean = useMediaQuery(theme.breakpoints.down("xs"));
    const fileInputRef: RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);
    const { mutateAsync: uploadPhoto, isPending } = useUploadPhotoMutation();

    useEffect((): (() => void) | void => {
        if (!previewUrl) return;
        return () => URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    const resetSelection = (): void => {
        setFile(null);
        setPreviewUrl(null);
        setAudience(DEFAULT_AUDIENCE);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleClose = (): void => {
        if (isPending) return;
        onOpenChange(false);
        resetSelection();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const picked: File | undefined = event.target.files?.[0];
        if (!picked) return;
        setFile(picked);
        setPreviewUrl(URL.createObjectURL(picked));
    };

    const handleUpload = async (): Promise<void> => {
        if (!file) return;
        try {
            const compressed: File = await prepareImageForUpload(file);
            await uploadPhoto({ file: compressed, type: PhotoUploadType.SHARED, audience });
            onOpenChange(false);
            resetSelection();
        } catch (error) {
            const errorMessage: string = (error as ApiError | Error)?.message;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    return (
        <>
            <Fab
                size={isLegacyMobile ? "small" : isMobile ? "medium" : "large"}
                color="primary"
                sx={{
                    left: 16,
                    position: "fixed",
                    top: "auto",
                    bottom: { xxs: 50, xs: 70, sm: 80 },
                }}
                onClick={() => onOpenChange(true)}
            >
                <AddPhotoAlternateIcon />
            </Fab>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleFileChange}
            />
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
                <DialogTitle variant="h4" color="primary">
                    Add photo to gallery
                </DialogTitle>
                <DialogContent>
                    {previewUrl && (
                        <Box
                            component="img"
                            src={previewUrl}
                            alt={file?.name}
                            sx={{ width: "100%", maxHeight: 240, objectFit: "contain", borderRadius: 1, mb: 2 }}
                        />
                    )}
                    <Button variant="outlined" fullWidth onClick={() => fileInputRef.current?.click()}>
                        {file ? "Choose another photo" : "Choose photo"}
                    </Button>
                    {file && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                            {file.name}
                        </Typography>
                    )}
                    <FormControl sx={{ mt: 2 }}>
                        <Typography color="primary" variant="subtitle1">
                            Visible on:
                        </Typography>
                        <RadioGroup
                            value={audience}
                            onChange={(_event, value: string) => setAudience(value as PhotoAudience)}
                        >
                            {PHOTO_AUDIENCE_ORDER.map((option: PhotoAudience) => (
                                <FormControlLabel
                                    key={option}
                                    value={option}
                                    control={<Radio />}
                                    label={PHOTO_AUDIENCE_LABELS[option]}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleUpload} loading={isPending} disabled={!file}>
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
