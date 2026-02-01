export interface VideoMetadata {
    width: number;
    height: number;
    duration: number;
}

export const getVideoMetadata = (file: File): Promise<VideoMetadata> => {
    return new Promise((resolve, reject): void => {
        const video: HTMLVideoElement = document.createElement("video");
        video.preload = "metadata";
        video.src = URL.createObjectURL(file);

        video.onloadedmetadata = (): void => {
            URL.revokeObjectURL(video.src);
            resolve({
                width: video.videoWidth,
                height: video.videoHeight,
                duration: video.duration,
            });
        };

        video.onerror = (): void => {
            URL.revokeObjectURL(video.src);
            reject(new Error(`Could not get video metadata for ${file.type}`));
        };
    });
};
