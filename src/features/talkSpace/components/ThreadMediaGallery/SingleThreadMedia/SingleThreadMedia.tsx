import Box from "@mui/material/Box";
import { FC, useState, MouseEvent } from "react";
import { ThreadMedia } from "@app/core/services";
import { stopEventPropagation } from "@app/core/utils/general.ts";
import { MediaItem } from "@app/features/talkSpace/components/ThreadMediaGallery/MediaItem";
import { SingleThreadMediaBackdrop } from "@app/features/talkSpace/components/ThreadMediaGallery/SingleThreadMediaBackdrop";

interface SingleThreadMediaProps {
    media: ThreadMedia;
}

export const SingleThreadMedia: FC<SingleThreadMediaProps> = memo(({ media }) => {
    const [open, setOpen] = useState<boolean>(false);

    const onClose = (_e: MouseEvent<HTMLElement>): void => setOpen(false);

    const handleOpen = (e: MouseEvent<HTMLElement>): void => {
        stopEventPropagation(e);
        setOpen(true);
    };
    return (
        <>
            <SingleThreadMediaBackdrop src={media.src} open={open} onClose={onClose} />
            <Box onClick={handleOpen} sx={{ my: 1, borderRadius: "12px" }}>
                <MediaItem media={media} />
            </Box>
        </>
    );
});
