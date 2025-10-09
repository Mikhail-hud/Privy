import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { FC, Activity } from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import MuiLink from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import { enqueueSnackbar } from "notistack";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import { QueryError } from "@app/core/interfaces";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { LINK_PATTERN } from "@app/core/constants/patterns";
import CircularProgress from "@mui/material/CircularProgress";
import { GENERIC_ERROR_MESSAGE } from "@app/core/constants/general";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { UserLink, useDeleteLinkMutation, useCreateLinkMutation, useUpdateLinkMutation } from "@app/core/services";

export const LINKS_FORM_FIELDS = {
    title: { name: "title", label: "Title" },
    url: { name: "url", label: "Url" },
} as const;

interface LinksFormValues {
    [LINKS_FORM_FIELDS.title.name]: string;
    [LINKS_FORM_FIELDS.url.name]: string;
}

const LINKS_FORM_FIELDS_VALUES: LinksFormValues = {
    [LINKS_FORM_FIELDS.title.name]: "",
    [LINKS_FORM_FIELDS.url.name]: "",
};

interface ManageLinksDialogProps {
    open: boolean;
    onClose: () => void;
    links: UserLink[];
}

export const ManageLinksDialog: FC<ManageLinksDialogProps> = memo(({ open, onClose, links }) => {
    const [view, setView] = useState<"list" | "form">("list");
    const [editingLink, setEditingLink] = useState<UserLink | null>(null);

    const [deleteLink] = useDeleteLinkMutation();
    const [createLink, { isLoading: isCreating }] = useCreateLinkMutation();
    const [updateLink, { isLoading: isUpdating }] = useUpdateLinkMutation();

    const { control, handleSubmit, reset } = useForm<LinksFormValues>({
        defaultValues: LINKS_FORM_FIELDS_VALUES,
    });

    useEffect(() => {
        if (view === "form") {
            if (editingLink) {
                reset({ title: editingLink.title, url: editingLink.url });
            } else {
                reset({ title: "", url: "" });
            }
        }
    }, [view, editingLink, reset]);

    const handleOpenEdit = (link: UserLink) => {
        setEditingLink(link);
        setView("form");
    };

    const handleOpenCreate = () => {
        setEditingLink(null);
        setView("form");
    };

    const handleBackToList = () => {
        setView("list");
        setEditingLink(null);
    };

    const handleDeleteLink = async (id: number): Promise<void> => {
        try {
            await deleteLink({ id }).unwrap();
            enqueueSnackbar("Link deleted", { variant: "success" });
        } catch (error) {
            const errorMessage = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    const onFormSubmit: SubmitHandler<LinksFormValues> = async data => {
        try {
            if (editingLink) {
                await updateLink({ id: editingLink.id, ...data }).unwrap();
                enqueueSnackbar("Link updated", { variant: "success" });
            } else {
                await createLink(data).unwrap();
                enqueueSnackbar("Link created", { variant: "success" });
            }
            handleBackToList();
        } catch (error) {
            const errorMessage = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle variant="h3" color="primary">
                {view === "form" && (
                    <IconButton onClick={handleBackToList} sx={{ mr: 1 }}>
                        <ArrowBackIcon />
                    </IconButton>
                )}
                {view === "list" ? "Manage Your Links" : editingLink ? "Edit Link" : "Create New Link"}
            </DialogTitle>

            <Activity mode={view === "list" ? "visible" : "hidden"}>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        {links.map(link => (
                            <Paper
                                key={link.id}
                                variant="outlined"
                                sx={{ display: "flex", alignItems: "center", p: 1 }}
                            >
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="subtitle2">{link.title}</Typography>
                                    <MuiLink href={link.url} target="_blank" variant="caption">
                                        {link.url}
                                    </MuiLink>
                                </Box>
                                <IconButton onClick={() => handleOpenEdit(link)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteLink(link.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Paper>
                        ))}
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenCreate}>
                        Add New Link
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Activity>

            <Activity mode={view === "form" ? "visible" : "hidden"}>
                <Box component="form" noValidate>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Controller
                            control={control}
                            name={LINKS_FORM_FIELDS.title.name}
                            rules={{ required: "Title is required" }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    error={!!error}
                                    helperText={error?.message}
                                    label={LINKS_FORM_FIELDS.title.label}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name={LINKS_FORM_FIELDS.url.name}
                            rules={{
                                required: "URL is required",
                                pattern: { value: LINK_PATTERN, message: "Invalid URL format" },
                            }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    error={!!error}
                                    label={LINKS_FORM_FIELDS.url.label}
                                    helperText={error?.message}
                                />
                            )}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleBackToList}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit(onFormSubmit)}
                            disabled={isCreating || isUpdating}
                        >
                            {isCreating || isUpdating ? <CircularProgress size={24} /> : "Save"}
                        </Button>
                    </DialogActions>
                </Box>
            </Activity>
        </Dialog>
    );
});
