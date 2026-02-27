import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    useCallback,
    ReactNode,
    FC,
    MouseEvent,
    RefObject,
} from "react";

interface VideoFeedContextType {
    isGlobalMuted: boolean;
    setGlobalPause: (pause: boolean, activeId?: string) => void;
    registerVideo: (id: string, element: HTMLVideoElement) => void;
    unregisterVideo: (id: string, element: HTMLVideoElement) => void;
    toggleGlobalMute: (event: MouseEvent<HTMLElement>) => void;
    getFeedVideoElement: (id: string) => HTMLVideoElement | null;
}

const VideoFeedContext = createContext<VideoFeedContextType | null>(null);

export const useVideoFeed = (): VideoFeedContextType => {
    const context: VideoFeedContextType | null = useContext(VideoFeedContext);
    if (!context) throw new Error("useVideoFeed must be used within VideoFeedProvider");
    return context;
};

export const VideoFeedProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [isGlobalMuted, setIsGlobalMuted] = useState<boolean>(true);
    const isGlobalPausedRef: RefObject<boolean> = useRef(false);
    const activeModalIdRef: RefObject<string | null> = useRef<string | null>(null);

    const videoElementsMapRef: RefObject<Map<string, HTMLVideoElement>> = useRef<Map<string, HTMLVideoElement>>(
        new Map()
    );

    const videosRef: RefObject<Map<HTMLVideoElement, number>> = useRef<Map<HTMLVideoElement, number>>(new Map());
    const observerRef: RefObject<IntersectionObserver | null> = useRef(null);

    const toggleGlobalMute = useCallback((_event: MouseEvent<HTMLElement>): void => {
        setIsGlobalMuted(prev => !prev);
    }, []);

    const calculateAndPlay = useCallback((): void => {
        if (isGlobalPausedRef.current) {
            videosRef.current.forEach((_ratio: number, video: HTMLVideoElement): void => {
                const videoId: string | undefined = video.dataset.mediaId;
                // If the video is the one in the active modal, we want to keep it playing, otherwise we pause it.
                if (videoId !== activeModalIdRef.current) {
                    if (!video.paused) video.pause();
                }
            });
            return;
        }

        let bestVideo: HTMLVideoElement | null = null;
        let maxRatio: number = 0;

        videosRef.current.forEach((ratio: number, video: HTMLVideoElement): void => {
            if (ratio > maxRatio) {
                maxRatio = ratio;
                bestVideo = video;
            }
        });

        videosRef.current.forEach((ratio: number, video: HTMLVideoElement): void => {
            if (video === bestVideo && ratio >= 0.5) {
                if (video.paused) video.play().catch(() => {});
            } else {
                if (!video.paused) video.pause();
            }
        });
    }, []);

    const setGlobalPause = useCallback(
        (pause: boolean, activeId?: string): void => {
            isGlobalPausedRef.current = pause;
            activeModalIdRef.current = activeId || null;
            calculateAndPlay();
        },
        [calculateAndPlay]
    );

    const getFeedVideoElement = useCallback((id: string): HTMLVideoElement | null => {
        return videoElementsMapRef.current.get(id) || null;
    }, []);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    const video = entry.target as HTMLVideoElement;
                    if (entry.isIntersecting) {
                        videosRef.current.set(video, entry.intersectionRatio);
                    } else {
                        videosRef.current.delete(video);
                        if (!video.paused) video.pause();
                    }
                });
                calculateAndPlay();
            },
            { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1.0], rootMargin: "-10% 0px -10% 0px" }
        );

        return () => observerRef.current?.disconnect();
    }, [calculateAndPlay]);

    const registerVideo = useCallback((id: string, element: HTMLVideoElement): void => {
        element.dataset.mediaId = id;
        videoElementsMapRef.current.set(id, element);

        if (observerRef.current) {
            observerRef.current.observe(element);
            videosRef.current.set(element, 0);
        }
    }, []);

    const unregisterVideo = useCallback((id: string, element: HTMLVideoElement): void => {
        videoElementsMapRef.current.delete(id);

        if (observerRef.current) {
            observerRef.current.unobserve(element);
            videosRef.current.delete(element);
            if (!element.paused) element.pause();
        }
    }, []);

    return (
        <VideoFeedContext.Provider
            value={{
                registerVideo,
                unregisterVideo,
                isGlobalMuted,
                toggleGlobalMute,
                setGlobalPause,
                getFeedVideoElement,
            }}
        >
            {children}
        </VideoFeedContext.Provider>
    );
};
