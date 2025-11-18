import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { Tag } from "@app/core/services";
import Dialog from "@mui/material/Dialog";
import { FC, memo, useState } from "react";
import { useIsMobile } from "@app/core/hooks";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

const chipSx = {
    color: "text.primary",
    borderRadius: "8px",
};

interface InterestListProps {
    interest: Tag[] | null | undefined;
}

const InterestListComponent: FC<InterestListProps> = ({ interest }) => {
    const isMobile: boolean = useIsMobile();
    const MAX_VISIBLE_CHIPS = isMobile ? 3 : 5;

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
            <Box
                sx={{
                    gap: 0.5,
                    mt: 0.5,
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: { xxs: "center", sm: "flex-start" },
                }}
            >
                {visibleInterests.map(tag => (
                    <Chip clickable key={tag.id} label={tag.name} sx={chipSx} />
                ))}

                {remainingCount > 0 && <Chip clickable sx={chipSx} onClick={handleOpen} label={`+${remainingCount}`} />}
            </Box>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
                <DialogTitle variant="h3" color="primary">
                    Interests
                </DialogTitle>
                <DialogContent dividers>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                        }}
                    >
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
