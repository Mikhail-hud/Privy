import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import DialogContent from "@mui/material/DialogContent";
import { SubmitHandler, useForm } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth, useMediaSelection } from "@app/core/hooks";
import { VALIDATE_RELES } from "@app/core/constants/rulesConstants.ts";
import { appendMediaToFormData } from "@app/core/utils/mediaFormData.ts";
import { closeSnackbar, enqueueSnackbar, SnackbarKey } from "notistack";
import { TextField, ThreadMediaGallery, VideoFeedProvider } from "@app/core/components";
import { FC, ReactNode, RefObject, SyntheticEvent, useEffect, useRef, useState } from "react";
import { stopEventPropagation, transformServerErrors } from "@app/core/utils/general.ts";
import {
    Thread,
    ApiError,
    CreateThreadPayload,
    useCreateThreadMutation,
    useUpdateThreadMutation,
} from "@app/core/services";
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

// TODO: FIX Video Provider to Pause exact item in Feed
export const ThreadDialogForm: FC<ThreadDialogProps> = props => (
    <VideoFeedProvider>
        <ThreadDialogFormContent {...props} />
    </VideoFeedProvider>
);

const ThreadDialogFormContent: FC<ThreadDialogProps> = ({ open, setOpen, mode = "create", thread, action }) => {
    const { profile } = useAuth();
    const isCreatingMode: boolean = mode === "create";
    const [valid, setValid] = useState<boolean>(true);

    const contentInputRef: RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);
    const fileInputRef: RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);

    const { selectedFiles, isProcessingFiles, handleFileSelect, handleRemoveFile, resetFiles } = useMediaSelection();

    const { mutateAsync: createThread, isPending: isCreating, error: createThreadError } = useCreateThreadMutation();
    const { mutateAsync: updateThread, isPending: isUpdating, error: updateTreadError } = useUpdateThreadMutation();

    const isMediaPreviewShown: boolean = !!selectedFiles.length && isCreatingMode;
    const isThreadMediaShown: boolean = !!thread?.media?.length && !isCreatingMode;

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
        resetFiles();
    };

    const handleAttachClick = (): void => fileInputRef.current?.click();

    const handleDialogEntered = (): void => {
        resetFiles();
        contentInputRef.current?.focus();
    };

    const isIncognito: boolean = watch(THREAD_DIALOG_FORM_FIELDS.isIncognito.name);
    const content: string = watch(THREAD_DIALOG_FORM_FIELDS.content.name);

    const onSubmitClick = (): void => {
        const isContentAvailable: boolean = !!content?.trim() || !!selectedFiles.length;
        setValid(isContentAvailable);
    };

    useEffect((): void => {
        if (!!content?.trim() || !!selectedFiles.length) {
            setValid(true);
        }
    }, [content, selectedFiles.length]);

    const isSubmitDisabled: boolean =
        isCreating || isUpdating || isProcessingFiles || (!content?.trim() && !selectedFiles.length);

    const onSubmit: SubmitHandler<ThreadFormValues> = async ({
        content,
        isIncognito,
    }: ThreadFormValues): Promise<void> => {
        if (isSubmitDisabled) {
            return;
        }
        setOpen(false);
        const publishingKey: SnackbarKey = enqueueSnackbar(
            mode === "edit" ? "Updating post..." : "Publishing post...",
            {
                persist: true,
                variant: "info",
                action: <CircularProgress size={16} color="inherit" />,
            }
        );
        try {
            if (mode === "edit" && thread) {
                await updateThread({ id: thread.id, data: { content, isIncognito } });
                closeSnackbar(publishingKey);
                enqueueSnackbar("Post updated successfully", { variant: "success" });
                reset();
                return;
            }
            const formData = new FormData();
            formData.append("content", content);
            formData.append("isIncognito", String(isIncognito));
            await appendMediaToFormData(formData, selectedFiles);

            await createThread(formData as unknown as CreateThreadPayload);
            closeSnackbar(publishingKey);
            enqueueSnackbar("Post published successfully", { variant: "success" });
            reset();
            resetFiles();
        } catch (error) {
            closeSnackbar(publishingKey);
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
                    paper: { sx: { width: "100%", maxWidth: 750, overflowX: "hidden" } },
                }}
            >
                <ThreadDialogTitle isCreatingMode={isCreatingMode} handleClose={handleClose} />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Divider />
                    <DialogContent>
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
                                {!valid && (
                                    <Typography variant="body1" color="error">
                                        Write a reply or attach media to continue.
                                    </Typography>
                                )}
                                {isMediaPreviewShown && (
                                    <MediaPreview files={selectedFiles} onRemove={handleRemoveFile} />
                                )}
                                {isThreadMediaShown && <ThreadMediaGallery threadMedia={thread?.media || []} />}
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
                        onSubmitClick={onSubmitClick}
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
