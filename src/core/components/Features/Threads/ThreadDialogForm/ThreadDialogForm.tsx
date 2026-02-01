import Box from "@mui/material/Box";
import { useAuth } from "@app/core/hooks";
import Dialog from "@mui/material/Dialog";
import { enqueueSnackbar } from "notistack";
import Divider from "@mui/material/Divider";
import {
    ALLOWED_POST_MIME_TYPES,
    COMPRESSED_IMAGE_SIZE,
    MAX_FILES_COUNT,
    MAX_IMAGE_INPUT_SIZE,
    MAX_VIDEO_INPUT_SIZE,
} from "@app/core/constants/patterns.ts";
import { TextField } from "@app/core/components";
import Typography from "@mui/material/Typography";
import DialogContent from "@mui/material/DialogContent";
import { SubmitHandler, useForm } from "react-hook-form";
import { VALIDATE_RELES } from "@app/core/constants/rulesConstants.ts";
import { ThreadMediaGallery } from "@app/features/talkSpace/components";
import { ChangeEvent, FC, ReactNode, SyntheticEvent, useRef } from "react";
import { compressImage, isImageFile, isVideoFile } from "@app/core/utils/fileUtils.ts";
import { stopEventPropagation, transformServerErrors } from "@app/core/utils/general.ts";
import {
    Thread,
    ApiError,
    Metadata,
    CreateThreadPayload,
    useCreateThreadMutation,
    useUpdateThreadMutation,
} from "@app/core/services";
import { getVideoMetadata, VideoMetadata } from "@app/core/utils/mediaMetadata.ts";
import { MediaPreview } from "@app/core/components/Features/Threads/ThreadDialogForm/MediaPreview";
import { ThreadActionIcons } from "@app/core/components/Features/Threads/ThreadDialogForm/ThreadActionIcons";
import { ThreadDialogTitle } from "@app/core/components/Features/Threads/ThreadDialogForm/ThreadDialogTitle";
import { ThreadDialogFooter } from "@app/core/components/Features/Threads/ThreadDialogForm/ThreadDialogFooter";
import { ThreadDialogUserAvatar } from "@app/core/components/Features/Threads/ThreadDialogForm/ThreadDialogUserAvatar";

type ThreadMode = "create" | "edit";

interface ThreadFormValues {
    content: string;
    isIncognito: boolean;
}

interface ThreadDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    mode?: ThreadMode;
    thread?: Thread;
    action?: ReactNode;
}

const DEFAULT_THREAD_FORM_VALUES: ThreadFormValues = {
    content: "",
    isIncognito: false,
};

export const THREAD_DIALOG_FORM_FIELDS = {
    content: { name: "content", label: "Content", placeholder: "What's on your mind?" },
    isIncognito: { name: "isIncognito", label: "Incognito" },
} as const;

export const ThreadDialogForm: FC<ThreadDialogProps> = ({ open, setOpen, mode = "create", thread, action }) => {
    const { profile } = useAuth();
    const isCreatingMode: boolean = mode === "create";

    const [isProcessingFiles, setIsProcessingFiles] = useState(false);

    const contentInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const { mutateAsync: createThread, isPending: isCreating, error: createThreadError } = useCreateThreadMutation();
    const { mutateAsync: updateThread, isPending: isUpdating, error: updateTreadError } = useUpdateThreadMutation();

    const isMediaPreviewShown: boolean = !!selectedFiles.length && isCreatingMode;
    const isTreadMediaShown: boolean = !!thread?.media?.length && !isCreatingMode;

    const { control, handleSubmit, reset, watch } = useForm<ThreadFormValues>({
        mode: "onChange",
        defaultValues: DEFAULT_THREAD_FORM_VALUES,
        values: {
            content: thread?.content || "",
            isIncognito: thread?.isIncognito || false,
        },
        errors: transformServerErrors(((createThreadError || updateTreadError) as unknown as ApiError)?.errors),
    });

    const handleClose = (event: SyntheticEvent): void => {
        stopEventPropagation(event);
        setOpen(false);
        reset();
        setSelectedFiles([]);
    };
    const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
        const files = e.target.files;
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
                        const sizeMB = Math.round(MAX_IMAGE_INPUT_SIZE / 1024 / 1024);
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

    const handleRemoveFile = (indexToRemove: number): void => {
        setSelectedFiles((files: File[]): File[] =>
            files.filter((_file: File, index: number): boolean => index !== indexToRemove)
        );
    };

    const handleAttachClick = (): void => fileInputRef.current?.click();

    const handleDialogEntered = (): void => {
        setSelectedFiles([]);
        contentInputRef.current?.focus();
    };

    const isIncognito: boolean = watch(THREAD_DIALOG_FORM_FIELDS.isIncognito.name);

    const onSubmit: SubmitHandler<ThreadFormValues> = async ({
        content,
        isIncognito,
    }: ThreadFormValues): Promise<void> => {
        try {
            setOpen(false);
            if (mode === "edit" && thread) {
                await updateThread({ id: thread.id, data: { content, isIncognito } });
                enqueueSnackbar("Post updated successfully", { variant: "success" });
                reset();
                setOpen(false);
                return;
            }
            const formData = new FormData();
            formData.append("content", content);
            formData.append("isIncognito", String(isIncognito));
            const metadataList: Metadata[] = [];
            for (let i = 0; i < selectedFiles.length; i++) {
                const file: File = selectedFiles[i];
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
                    } catch (_error) {
                        enqueueSnackbar(`Could not read metadata for ${file.name}`, { variant: "error" });
                    }
                }
            }

            if (metadataList.length > 0) {
                formData.append("mediaMetadata", JSON.stringify(metadataList));
            }
            await createThread(formData as unknown as CreateThreadPayload);
            enqueueSnackbar("Post created successfully", { variant: "success" });
            reset();
            setSelectedFiles([]);
            setOpen(false);
        } catch (error) {
            const errorMessage: string = (error as ApiError)?.message;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    const avatarUrl: string | undefined = profile?.isProfileIncognito
        ? profile?.privatePhoto?.src
        : profile?.publicPhoto?.src;

    return (
        <>
            {action}
            <Dialog
                fullWidth
                open={open}
                onClose={handleClose}
                onClick={e => e.stopPropagation()}
                slotProps={{
                    transition: { onEntered: handleDialogEntered },
                    paper: { sx: { width: "100%", maxWidth: 750 } },
                }}
            >
                <ThreadDialogTitle isCreatingMode={isCreatingMode} handleClose={handleClose} />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Divider />
                    <DialogContent sx={{ overflow: "auto" }}>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <ThreadDialogUserAvatar
                                avatarSrc={avatarUrl}
                                isIncognito={isIncognito}
                                userName={profile.userName}
                                isCreatingMode={isCreatingMode}
                                isProfileIncognito={profile.isProfileIncognito}
                            />
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Typography variant="body2" color="textPrimary">
                                    {isIncognito ? "Incognito User" : `@${profile.userName}`}
                                </Typography>
                                <TextField<ThreadFormValues>
                                    minRows={2}
                                    control={control}
                                    variant="standard"
                                    inputRef={contentInputRef}
                                    rules={VALIDATE_RELES.THREAD_CONTENT}
                                    name={THREAD_DIALOG_FORM_FIELDS.content.name}
                                    slotProps={{ input: { disableUnderline: true } }}
                                    placeholder={THREAD_DIALOG_FORM_FIELDS.content.placeholder}
                                />
                                {isMediaPreviewShown && (
                                    <MediaPreview files={selectedFiles} onRemove={handleRemoveFile} />
                                )}
                                {isTreadMediaShown && <ThreadMediaGallery threadMedia={thread?.media || []} />}
                                {isCreatingMode && (
                                    <ThreadActionIcons
                                        fileInputRef={fileInputRef}
                                        isProcessingFiles={isProcessingFiles}
                                        handleFileSelect={handleFileSelect}
                                        handleAttachClick={handleAttachClick}
                                    />
                                )}
                            </Box>
                        </Box>
                    </DialogContent>
                    <Divider />
                    <ThreadDialogFooter<ThreadFormValues>
                        control={control}
                        handleClose={handleClose}
                        isCreatingMode={isCreatingMode}
                        loading={isCreating || isUpdating}
                        label={THREAD_DIALOG_FORM_FIELDS.isIncognito.label}
                        name={THREAD_DIALOG_FORM_FIELDS.isIncognito.name}
                    />
                </form>
            </Dialog>
        </>
    );
};
