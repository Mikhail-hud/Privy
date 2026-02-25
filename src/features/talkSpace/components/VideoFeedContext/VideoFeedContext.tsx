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
    setGlobalPause: (pause: boolean) => void;
    registerVideo: (element: HTMLVideoElement) => void;
    unregisterVideo: (element: HTMLVideoElement) => void;
    toggleGlobalMute: (event: MouseEvent<HTMLElement>) => void;
    syncTimeFromModal: (src: string, time: number) => void;
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

    const videosRef: RefObject<Map<HTMLVideoElement, number>> = useRef<Map<HTMLVideoElement, number>>(new Map());
    const observerRef: RefObject<IntersectionObserver | null> = useRef<IntersectionObserver | null>(null);

    const toggleGlobalMute = useCallback((_event: MouseEvent<HTMLElement>): void => {
        setIsGlobalMuted(prev => !prev);
    }, []);

    const calculateAndPlay = useCallback((): void => {
        if (isGlobalPausedRef.current) {
            videosRef.current.forEach((_ratio: number, video: HTMLVideoElement): void => {
                if (!video.paused) video.pause();
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
        (pause: boolean): void => {
            isGlobalPausedRef.current = pause;
            calculateAndPlay();
        },
        [calculateAndPlay]
    );
    const syncTimeFromModal = useCallback((src: string, time: number): void => {
        videosRef.current.forEach((_, video: HTMLVideoElement): void => {
            const videoSrc: string | null = video.getAttribute("src");
            if (videoSrc === src) {
                video.currentTime = time;
            }
        });
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

    const registerVideo = useCallback((element: HTMLVideoElement): void => {
        if (observerRef.current) {
            observerRef.current.observe(element);
            videosRef.current.set(element, 0);
        }
    }, []);

    const unregisterVideo = useCallback((element: HTMLVideoElement): void => {
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
                syncTimeFromModal,
            }}
        >
            {children}
        </VideoFeedContext.Provider>
    );
};
