import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { enqueueSnackbar } from "notistack";
import Typography from "@mui/material/Typography";
import { FC, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Switch, TextField } from "@app/core/components";
import { useAuth, useMediaSelection } from "@app/core/hooks";
import { transformServerErrors } from "@app/core/utils/general.ts";
import { VALIDATE_RELES } from "@app/core/constants/rulesConstants.ts";
import { appendMediaToFormData } from "@app/core/utils/mediaFormData.ts";
import { ApiError, CreateReplyPayload, useCreateReplyMutation } from "@app/core/services";
import { MediaPreview } from "@app/core/components/Features/Threads/ThreadDialogForm/MediaPreview";
import { ThreadActionIcons } from "@app/core/components/Features/Threads/ThreadDialogForm/ThreadActionIcons";
import { ThreadDialogUserAvatar } from "@app/core/components/Features/Threads/ThreadDialogForm/ThreadDialogUserAvatar";

interface ReplyFormValues {
    content: string;
    isIncognito: boolean;
}

interface ReplyFormProps {
    threadId: string;
}

const DEFAULT_REPLY_FORM_VALUES: ReplyFormValues = {
    content: "",
    isIncognito: false,
};

export const REPLY_FORM_FIELDS = {
    content: { name: "content", label: "Reply", placeholder: "Post your reply" },
    isIncognito: { name: "isIncognito", label: "Incognito" },
} as const;

export const ReplyForm: FC<ReplyFormProps> = ({ threadId }) => {
    const { profile } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [valid, setValid] = useState<boolean>(true);

    const { selectedFiles, isProcessingFiles, handleFileSelect, handleRemoveFile, resetFiles } = useMediaSelection();
    const { mutateAsync: createReply, isPending: isCreating, error: createReplyError } = useCreateReplyMutation();

    const { control, handleSubmit, reset, watch } = useForm<ReplyFormValues>({
        mode: "onChange",
        defaultValues: DEFAULT_REPLY_FORM_VALUES,
        errors: transformServerErrors((createReplyError as unknown as ApiError)?.errors),
    });

    const isIncognito: boolean = watch(REPLY_FORM_FIELDS.isIncognito.name);
    const content: string = watch(REPLY_FORM_FIELDS.content.name);
    const isSubmitDisabled: boolean = isCreating || isProcessingFiles || (!content?.trim() && !selectedFiles.length);

    const handleAttachClick = (): void => fileInputRef.current?.click();

    const avatarUrl: string | undefined = profile?.isProfileIncognito
        ? profile?.privatePhoto?.src
        : profile?.publicPhoto?.src;

    const validate = () => {
        const isContentAvailable: boolean = !!content?.trim() || !!selectedFiles.length;
        setValid(isContentAvailable);
    };

    useEffect((): void => {
        if (!!content?.trim() || !!selectedFiles.length) {
            setValid(true);
        }
    }, [content, selectedFiles.length]);

    const onSubmit: SubmitHandler<ReplyFormValues> = async ({ content, isIncognito }): Promise<void> => {
        if (isSubmitDisabled) {
            return;
        }
        try {
            const formData = new FormData();
            formData.append("content", content);
            formData.append("isIncognito", String(isIncognito));
            await appendMediaToFormData(formData, selectedFiles);

            await createReply({ threadId, data: formData as unknown as CreateReplyPayload });
            enqueueSnackbar("Reply posted successfully", { variant: "success" });
            reset(DEFAULT_REPLY_FORM_VALUES);
            resetFiles();
        } catch (error) {
            const errorMessage: string = (error as ApiError)?.message;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ px: 2, py: 1.5 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
                <ThreadDialogUserAvatar
                    isCreatingMode
                    avatarSrc={avatarUrl}
                    isIncognito={isIncognito}
                    userName={profile.userName}
                    isProfileIncognito={profile.isProfileIncognito}
                />
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="body2" color="textPrimary">
                        {isIncognito ? "Incognito User" : `@${profile.userName}`}
                    </Typography>
                    <TextField<ReplyFormValues>
                        minRows={1}
                        control={control}
                        variant="standard"
                        rules={VALIDATE_RELES.REPLY_CONTENT}
                        name={REPLY_FORM_FIELDS.content.name}
                        slotProps={{ input: { disableUnderline: true } }}
                        placeholder={REPLY_FORM_FIELDS.content.placeholder}
                    />
                    {!valid && (
                        <Typography variant="body1" color="error">
                            Write a reply or attach media to continue.
                        </Typography>
                    )}
                    {!!selectedFiles.length && <MediaPreview files={selectedFiles} onRemove={handleRemoveFile} />}
                    <Box
                        sx={{
                            gap: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <ThreadActionIcons
                            fileInputRef={fileInputRef}
                            isProcessingFiles={isProcessingFiles}
                            handleFileSelect={handleFileSelect}
                            handleAttachClick={handleAttachClick}
                        />
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <Box sx={{ width: 130 }}>
                                <Switch<ReplyFormValues>
                                    control={control}
                                    label={REPLY_FORM_FIELDS.isIncognito.label}
                                    name={REPLY_FORM_FIELDS.isIncognito.name}
                                />
                            </Box>
                            <Button
                                size="small"
                                type="submit"
                                variant="contained"
                                loading={isCreating}
                                onClick={validate}
                                loadingPosition="start"
                            >
                                Reply
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
