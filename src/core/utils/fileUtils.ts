import imageCompression from "browser-image-compression";
import { ALLOWED_IMAGE_MIME_TYPES, COMPRESSED_IMAGE_SIZE, MAX_IMAGE_INPUT_SIZE } from "@app/core/constants/patterns";

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

/**
 * Validates and compresses a picked image so it fits what the photo endpoint accepts.
 *
 * Throws with the message meant for the user, so callers can hand it straight to a snackbar the way
 * they already do with API errors.
 */
export const prepareImageForUpload = async (file: File): Promise<File> => {
    if (!ALLOWED_IMAGE_MIME_TYPES.test(file.type)) {
        throw new Error("Invalid file type. Allowed types: JPEG, PNG, GIF, WEBP, SVG.");
    }
    if (file.size > MAX_IMAGE_INPUT_SIZE) {
        throw new Error("File size must not exceed 30 MB");
    }

    const compressed: File = await compressImage(file);

    if (compressed.size > COMPRESSED_IMAGE_SIZE) {
        throw new Error("File size must not exceed 5 MB after compression");
    }
    return compressed;
};

export const isVideoFile = (file: File): boolean => {
    return file.type.startsWith("video/");
};

export const isImageFile = (file: File): boolean => {
    return file.type.startsWith("image/");
};
