import Box from "@mui/material/Box";
import { FC, MouseEvent } from "react";
import { ThreadMedia } from "@app/core/services";
import { stopEventPropagation } from "@app/core/utils/general.ts";
import { MediaItem } from "@app/features/talkSpace/components/ThreadMediaGallery/MediaItem";

interface SingleThreadMediaProps {
    media: ThreadMedia;
    handleOpenThreadMediaBackdrop: (media: ThreadMedia) => void;
}

export const SingleThreadMedia: FC<SingleThreadMediaProps> = memo(({ media, handleOpenThreadMediaBackdrop }) => {
    const handleOpen = (e: MouseEvent<HTMLElement>): void => {
        stopEventPropagation(e);
        handleOpenThreadMediaBackdrop(media);
    };
    return (
        <>
            <Box onClick={handleOpen} sx={{ my: 1, borderRadius: "12px" }}>
                <MediaItem media={media} />
            </Box>
        </>
    );
});
