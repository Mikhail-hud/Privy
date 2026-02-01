import imageCompression from "browser-image-compression";

export const compressImage = async (file: File): Promise<File> => {
    if (!file.type.startsWith("image/")) {
        return file;
    }

    const options = {
        maxSizeMB: 1, // Target size in MB
        // maxWidthOrHeight: 1920, // Max width or height
        useWebWorker: true, // Use web worker for better performance
        fileType: "image/webp", // Convert to WebP format
        initialQuality: 0.8, // Initial quality setting
    };

    try {
        const compressedBlob: File = await imageCompression(file, options);
        const newFileName: string = file.name.replace(/\.[^/.]+$/, "") + ".webp";

        return new File([compressedBlob], newFileName, {
            type: "image/webp",
            lastModified: Date.now(),
        });
    } catch (error) {
        console.error("Compression failed:", error);
        return file;
    }
};

export const isVideoFile = (file: File): boolean => {
    return file.type.startsWith("video/");
};

export const isImageFile = (file: File): boolean => {
    return file.type.startsWith("image/");
};
