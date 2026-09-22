import { ThreadMedia } from "@app/core/services";
import { ReactElement, useCallback, useState } from "react";
import { useVideoFeed } from "@app/core/components/Features/Threads/VideoFeedContext";
import { ThreadMediaBackdrop } from "@app/core/components/Features/Threads/ThreadMediaGallery/ThreadMediaBackdrop";
import { ThreadMediaGalleryBackdrop } from "@app/core/components/Features/Threads/ThreadMediaGallery/ThreadMediaGalleryBackdrop";

interface UseMediaBackdrops {
    handleOpenThreadMediaBackdrop: (media: ThreadMedia) => void;
    handleOpenThreadMediaGalleryBackdrop: (media: ThreadMedia[], index: number) => void;
    /** Render this once inside the consuming component — it holds both backdrops. */
    backdrops: ReactElement;
}

/**
 * Owns the full-screen media viewers shared by every list of threads or replies.
 *
 * A single media opens the standalone backdrop, a gallery opens the swipeable one, and either way
 * the inline video feed is paused for as long as a backdrop is up so two players never run at once.
 */
export const useMediaBackdrops = (): UseMediaBackdrops => {
    const { setGlobalPause } = useVideoFeed();

    const [mediaGalleryState, setMediaGalleryState] = useState<{
        isOpen: boolean;
        media: ThreadMedia[];
        initialSlide: number;
    }>({
        isOpen: false,
        media: [],
        initialSlide: 0,
    });

    const [threadMediaState, setThreadMediaState] = useState<{
        media: ThreadMedia | null;
        open: boolean;
    }>({
        media: null,
        open: false,
    });

    const handleOpenThreadMediaGalleryBackdrop = useCallback(
        (media: ThreadMedia[], index: number): void => {
            const activeMedia: ThreadMedia = media[index];
            setGlobalPause(true, activeMedia?.id);
            setMediaGalleryState({ isOpen: true, media, initialSlide: index });
        },
        [setGlobalPause]
    );

    const handleCloseMediaGalleryBackdrop = useCallback((): void => {
        setGlobalPause(false);
        setMediaGalleryState({ media: [], isOpen: false, initialSlide: 0 });
    }, [setGlobalPause]);

    const handleOpenThreadMediaBackdrop = useCallback(
        (media: ThreadMedia): void => {
            setGlobalPause(true, media?.id);
            setThreadMediaState({ media, open: true });
        },
        [setGlobalPause]
    );

    const handleCloseThreadMediaBackdrop = useCallback((): void => {
        setGlobalPause(false);
        setThreadMediaState({ media: null, open: false });
    }, [setGlobalPause]);

    const backdrops: ReactElement = (
        <>
            <ThreadMediaGalleryBackdrop
                open={mediaGalleryState.isOpen}
                media={mediaGalleryState.media}
                onClose={handleCloseMediaGalleryBackdrop}
                initialSlide={mediaGalleryState.initialSlide}
            />
            <ThreadMediaBackdrop
                open={threadMediaState.open}
                media={threadMediaState.media}
                onClose={handleCloseThreadMediaBackdrop}
            />
        </>
    );

    return { handleOpenThreadMediaBackdrop, handleOpenThreadMediaGalleryBackdrop, backdrops };
};
