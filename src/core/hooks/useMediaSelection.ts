import { enqueueSnackbar } from "notistack";
import { ChangeEvent, useCallback, useState } from "react";
import { compressImage, isImageFile, isVideoFile } from "@app/core/utils/fileUtils.ts";
import {
    ALLOWED_POST_MIME_TYPES,
    COMPRESSED_IMAGE_SIZE,
    MAX_FILES_COUNT,
    MAX_IMAGE_INPUT_SIZE,
    MAX_VIDEO_INPUT_SIZE,
} from "@app/core/constants/patterns.ts";

interface UseMediaSelection {
    selectedFiles: File[];
    isProcessingFiles: boolean;
    handleFileSelect: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleRemoveFile: (indexToRemove: number) => void;
    resetFiles: () => void;
}

/**
 * Holds the media a post or reply is being composed with.
 *
 * Validates every picked file against the mime type, per-file size and per-post count limits,
 * compresses images, and reports every rejection through a snackbar so the caller only ever sees
 * files that are ready to upload.
 */
export const useMediaSelection = (): UseMediaSelection => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isProcessingFiles, setIsProcessingFiles] = useState<boolean>(false);

    const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
        const files: FileList | null = e.target.files;
        if (!files || files.length === 0) return;

        if (selectedFiles.length + files.length > MAX_FILES_COUNT) {
            enqueueSnackbar(`You can upload a maximum of ${MAX_FILES_COUNT} files per post`, { variant: "warning" });
            if (e.target) e.target.value = "";
            return;
        }

        setIsProcessingFiles(true);

        try {
            const newFiles: File[] = Array.from(files);
            const processedFiles: File[] = [];

            for (const file of newFiles) {
                if (!ALLOWED_POST_MIME_TYPES.test(file.type)) {
                    enqueueSnackbar(`File type not supported: ${file.name}`, { variant: "error" });
                    console.warn(`Skipped disallowed type: ${file.type}`);
                    continue;
                }
                if (isVideoFile(file)) {
                    if (file.size > MAX_VIDEO_INPUT_SIZE) {
                        const sizeMB: number = Math.round(MAX_VIDEO_INPUT_SIZE / 1024 / 1024);
                        enqueueSnackbar(`Video ${file.name} is too large (Max ${sizeMB}MB)`, { variant: "error" });
                        continue;
                    }
                    processedFiles.push(file);
                    continue;
                }

                if (isImageFile(file)) {
                    if (file.size > MAX_IMAGE_INPUT_SIZE) {
                        const sizeMB: number = Math.round(MAX_IMAGE_INPUT_SIZE / 1024 / 1024);
                        enqueueSnackbar(`Image ${file.name} is too large (Max ${sizeMB}MB input)`, {
                            variant: "error",
                        });
                        continue;
                    }

                    try {
                        const compressed: File = await compressImage(file);

                        if (compressed.size > COMPRESSED_IMAGE_SIZE) {
                            enqueueSnackbar(`Image ${file.name} is still too large after compression`, {
                                variant: "error",
                            });
                            continue;
                        }
                        processedFiles.push(compressed);
                    } catch (err) {
                        console.error("Compression error", err);
                        enqueueSnackbar(`Failed to process image ${file.name}`, { variant: "error" });
                    }
                    continue;
                }
                enqueueSnackbar(`File type not supported: ${file.name}`, { variant: "error" });
            }

            setSelectedFiles((prev: File[]): File[] => [...prev, ...processedFiles]);
        } catch (error) {
            console.error(error);
            enqueueSnackbar("An error occurred while processing files", { variant: "error" });
        } finally {
            setIsProcessingFiles(false);
            if (e.target) e.target.value = "";
        }
    };

    const handleRemoveFile = useCallback((indexToRemove: number): void => {
        setSelectedFiles((files: File[]): File[] =>
            files.filter((_file: File, index: number): boolean => index !== indexToRemove)
        );
    }, []);

    const resetFiles = useCallback((): void => setSelectedFiles([]), []);

    return { selectedFiles, isProcessingFiles, handleFileSelect, handleRemoveFile, resetFiles };
};
