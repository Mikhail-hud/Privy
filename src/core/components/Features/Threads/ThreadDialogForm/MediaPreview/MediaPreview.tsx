import "swiper/css";
import "swiper/css/pagination";
import { Box, Theme } from "@mui/material";
import { FreeMode } from "swiper/modules";
import { useTheme } from "@app/core/providers";
import CloseIcon from "@mui/icons-material/Close";
import { Swiper, SwiperSlide } from "swiper/react";
import { ActionIconButton } from "@app/core/components";
import { CSSProperties, FC, MouseEvent, useEffect } from "react";
import { stopEventPropagation } from "@app/core/utils/general.ts";

interface MediaPreviewProps {
    files: File[];
    onRemove: (index: number) => void;
}
interface FilePreview {
    file: File;
    src: string;
    type: string;
}

export const MediaPreview: FC<MediaPreviewProps> = ({ files, onRemove }) => {
    const theme: Theme = useTheme();
    const [previews, setPreviews] = useState<FilePreview[]>([]);

    useEffect(() => {
        const newPreviews: FilePreview[] = files.map(
            (file: File): FilePreview => ({
                file,
                src: URL.createObjectURL(file),
                type: file.type,
            })
        );

        setPreviews(newPreviews);
        return () => {
            for (const preview of newPreviews) {
                URL.revokeObjectURL(preview.src);
            }
        };
    }, [files]);

    const handleRemove =
        (index: number) =>
        (event: MouseEvent<HTMLButtonElement>): void => {
            stopEventPropagation(event);
            onRemove(index);
        };

    return (
        <Box sx={{ my: 1, height: 150, width: "auto" }}>
            <Swiper
                freeMode
                grabCursor
                spaceBetween={10}
                modules={[FreeMode]}
                slidesPerView="auto"
                style={
                    {
                        width: "100%",
                        height: "100%",
                        paddingBottom: "2px",
                    } as CSSProperties
                }
            >
                {previews.map((preview: FilePreview, index: number) => {
                    const isVideo: boolean = preview.type.startsWith("video/");

                    return (
                        <SwiperSlide
                            key={`${preview.file.name}-${index}`}
                            style={{
                                height: "100%",
                                width: "fit-content",
                                position: "relative",
                                borderRadius: "15px",
                                overflow: "hidden",
                                border: `1px solid ${theme.palette.divider}`,
                            }}
                        >
                            {isVideo ? (
                                <video
                                    src={preview.src}
                                    // TODO: ADD proper video preview handling (play on hover, etc.)
                                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                    controls={false}
                                    muted // Автоплей обычно требует muted
                                />
                            ) : (
                                <img alt="preview" src={preview.src} style={{ maxHeight: "100%", height: "100%" }} />
                            )}
                            <ActionIconButton
                                size="small"
                                icon={<CloseIcon fontSize="small" />}
                                sx={{ top: 4, right: 4, position: "absolute" }}
                                onClick={handleRemove(index)}
                            />
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </Box>
    );
};
