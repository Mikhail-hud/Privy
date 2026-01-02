import Box from "@mui/material/Box";
import { SyntheticEvent } from "react";
import Button from "@mui/material/Button";
import { Switch } from "@app/core/components";
import DialogActions from "@mui/material/DialogActions";
import { Control, FieldValues, Path } from "react-hook-form";

type ThreadDialogFooterProps<T extends FieldValues> = {
    name: Path<T>;
    label?: string;
    loading: boolean;
    control: Control<T>;
    isCreatingMode: boolean;
    handleClose: (event: SyntheticEvent) => void;
};

export const ThreadDialogFooter = <T extends FieldValues>({
    control,
    loading,
    isCreatingMode,
    handleClose,
    name,
    label,
}: ThreadDialogFooterProps<T>) => (
    <DialogActions sx={{ pt: 1, pb: 2, px: 2, gap: 1, display: "flex", flexDirection: "column", width: "100%" }}>
        <Box sx={{ width: "100%" }}>
            <Switch<T>
                name={name}
                label={label}
                control={control}
                description="When enabled, your name and profile will be hidden from other users. Your post will appear fully anonymous, and no one will be able to identify you as the author."
            />
        </Box>
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", width: "100%" }}>
            <Button onClick={handleClose} disabled={loading}>
                Cancel
            </Button>
            <Button variant="contained" type="submit" loadingPosition="start" loading={loading}>
                {isCreatingMode ? "Post" : "Update"}
            </Button>
        </Box>
    </DialogActions>
);
