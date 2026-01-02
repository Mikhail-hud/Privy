import Box from "@mui/material/Box";
import { useAuth } from "@app/core/hooks";
import Dialog from "@mui/material/Dialog";
import { enqueueSnackbar } from "notistack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { TextField } from "@app/core/components";
import DialogContent from "@mui/material/DialogContent";
import { useForm, SubmitHandler } from "react-hook-form";
import { VALIDATE_RELES } from "@app/core/constants/rulesConstants.ts";
import { FC, ReactNode, SyntheticEvent, useRef, ChangeEvent } from "react";
import { stopEventPropagation, transformServerErrors } from "@app/core/utils/general.ts";
import {
    ApiError,
    Thread,
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

export const ThreadDialogForm: FC<ThreadDialogProps> = ({ open, setOpen, mode = "create", thread, action }) => {
    const { profile } = useAuth();
    const isCreatingMode: boolean = mode === "create";

    const contentInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const { mutateAsync: createThread, isPending: isCreating, error: createThreadError } = useCreateThreadMutation();
    const { mutateAsync: updateThread, isPending: isUpdating, error: updateTreadError } = useUpdateThreadMutation();

    const isMediaPreviewShown: boolean = !!selectedFiles.length;

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
    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files.length) {
            const newFiles: File[] = Array.from(e.target.files);
            const validFiles: File[] = newFiles.filter((file: File): boolean => file.size <= 50 * 1024 * 1024);
            setSelectedFiles((file: File[]) => [...file, ...validFiles]);
        }
        // Reset the input value to allow selecting the same file again if needed
        if (e.target) e.target.value = "";
    };

    const handleRemoveFile = (indexToRemove: number): void => {
        setSelectedFiles((files: File[]) =>
            files.filter((_file: File, index: number): boolean => index !== indexToRemove)
        );
    };

    const handleAttachClick = (): void => fileInputRef.current?.click();

    const handleDialogEntered = (): void => contentInputRef.current?.focus();

    const isIncognito: boolean = watch(THREAD_DIALOG_FORM_FIELDS.isIncognito.name);

    const onSubmit: SubmitHandler<ThreadFormValues> = async ({
        content,
        isIncognito,
    }: ThreadFormValues): Promise<void> => {
        try {
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

            for (const file of selectedFiles) {
                formData.append("media", file);
            }
            await createThread(formData as unknown as CreateThreadPayload);
            enqueueSnackbar("Post created successfully", { variant: "success" });
            reset();
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
                                {isCreatingMode && (
                                    <ThreadActionIcons
                                        fileInputRef={fileInputRef}
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
