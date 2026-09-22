import { enqueueSnackbar } from "notistack";
import { Metadata } from "@app/core/services";
import { isVideoFile } from "@app/core/utils/fileUtils.ts";
import { getVideoMetadata, VideoMetadata } from "@app/core/utils/mediaMetadata.ts";

/**
 * Appends composed media to a thread/reply `FormData` payload.
 *
 * Every file goes in under `media`; videos additionally contribute a `mediaMetadata` entry so the
 * API knows their dimensions and duration before transcoding. A file whose metadata cannot be read
 * is still uploaded — only its metadata is skipped, with a snackbar explaining why.
 */
export const appendMediaToFormData = async (formData: FormData, files: File[]): Promise<void> => {
    const metadataList: Metadata[] = [];

    for (let i = 0; i < files.length; i++) {
        const file: File = files[i];
        formData.append("media", file);

        if (isVideoFile(file)) {
            try {
                const meta: VideoMetadata = await getVideoMetadata(file);
                metadataList.push({
                    index: i,
                    width: meta.width,
                    height: meta.height,
                    duration: Math.round(meta.duration),
                });
            } catch {
                enqueueSnackbar(`Could not read metadata for ${file.name}`, { variant: "error" });
            }
        }
    }

    if (metadataList.length > 0) {
        formData.append("mediaMetadata", JSON.stringify(metadataList));
    }
};
