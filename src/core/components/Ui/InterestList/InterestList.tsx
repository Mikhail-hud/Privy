import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { Tag } from "@app/core/services";
import Dialog from "@mui/material/Dialog";
import { FC, memo, useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

const chipSx = {
    color: "text.primary",
    borderRadius: "8px",
};

const MAX_VISIBLE_CHIPS = 5;

interface InterestListProps {
    interest?: Tag[];
}

const InterestListComponent: FC<InterestListProps> = ({ interest }) => {
    // TODO ADD FILTER THREADS BY INTERESTS
    const [open, setOpen] = useState(false);

    if (!interest || !interest.length) {
        return null;
    }

    const handleOpen = (): void => setOpen(true);
    const handleClose = (): void => setOpen(false);

    const visibleInterests: Tag[] = interest.slice(0, MAX_VISIBLE_CHIPS);
    const remainingCount: number = interest.length - MAX_VISIBLE_CHIPS;

    return (
        <>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
                {visibleInterests.map(tag => (
                    <Chip clickable key={tag.id} label={tag.name} />
                ))}

                {remainingCount > 0 && <Chip clickable sx={chipSx} onClick={handleOpen} label={`+${remainingCount}`} />}
            </Box>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
                <DialogTitle variant="h3" color="primary">
                    Interests
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {interest.map(tag => (
                            <Chip key={tag.id} label={tag.name} sx={chipSx} clickable />
                        ))}
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export const InterestList = memo(InterestListComponent);
