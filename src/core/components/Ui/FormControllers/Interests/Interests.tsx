import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import { enqueueSnackbar } from "notistack";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, FC, SyntheticEvent } from "react";
import { FormFieldShell } from "@app/core/components";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useDebounce, useIsMobile } from "@app/core/hooks";
import { DEBOUNCE_DELAY } from "@app/core/constants/general";
import CircularProgress from "@mui/material/CircularProgress";
import DialogContentText from "@mui/material/DialogContentText";
import { transformServerErrors } from "@app/core/utils/general.ts";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Autocomplete, { AutocompleteInputChangeReason } from "@mui/material/Autocomplete";
import { useGetTagsQuery, useUpdateProfileInterestsMutation, Tag, ApiError } from "@app/core/services";

export const INTERESTS_FORM_FIELDS = {
    interests: { name: "interests", label: "Interests" },
} as const;

interface InterestsValues {
    [INTERESTS_FORM_FIELDS.interests.name]: Tag[];
}

const INTERESTS_FORM_FIELDS_VALUES: InterestsValues = {
    [INTERESTS_FORM_FIELDS.interests.name]: [],
};

interface InterestsProps {
    interests: Tag[];
}

export const Interests: FC<InterestsProps> = memo(({ interests }) => {
    const isMobile: boolean = useIsMobile();
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState<string>("");

    const debouncedInputValue: string = useDebounce(inputValue, DEBOUNCE_DELAY);

    const { data: allTags = [], isLoading: isLoadingTags } = useGetTagsQuery(
        { name: debouncedInputValue },
        { enabled: open && !!debouncedInputValue }
    );
    const { mutateAsync: updateInterests, isPending, error } = useUpdateProfileInterestsMutation();

    const { control, handleSubmit, reset } = useForm<InterestsValues>({
        defaultValues: INTERESTS_FORM_FIELDS_VALUES,
        errors: transformServerErrors((error as unknown as ApiError)?.errors),
    });

    const handleOpen = (): void => {
        reset({ interests });
        setInputValue("");
        setOpen(true);
    };

    const handleClose = (): void => setOpen(false);

    const onValidSubmit: SubmitHandler<InterestsValues> = async data => {
        try {
            const tagIds: number[] = data.interests.map(tag => tag.id);
            await updateInterests({ interests: tagIds });
            enqueueSnackbar("Interests have been updated", { variant: "success" });
            handleClose();
        } catch (error) {
            enqueueSnackbar((error as ApiError)?.message, {
                variant: "error",
            });
        }
    };

    const handleInputChange = useCallback(
        (_event: SyntheticEvent, newInputValue: string, reason: AutocompleteInputChangeReason) => {
            if (reason === "input") {
                setInputValue(newInputValue);
            }
        },
        [setInputValue]
    );

    return (
        <FormFieldShell<Tag>
            data={interests}
            onClick={handleOpen}
            label={INTERESTS_FORM_FIELDS.interests.label}
            render={tag => <Chip key={tag.id} label={tag.name} size="small" />}
            placeholder="Select interests so that we can select relevant content and people for you"
        >
            <Dialog
                open={open}
                maxWidth={false}
                onClose={handleClose}
                fullScreen={isMobile}
                slotProps={{ paper: { component: "form" } }}
                sx={{ margin: "auto", maxWidth: 850 }}
            >
                <DialogTitle variant="h3" color="primary">
                    {INTERESTS_FORM_FIELDS.interests.label}
                </DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                    <DialogContentText>
                        Select interests so that we can select relevant content and people for you. Your interests will
                        be visible in your profile.
                    </DialogContentText>
                    <Controller
                        control={control}
                        name={INTERESTS_FORM_FIELDS.interests.name}
                        render={({ field, fieldState: { error } }) => (
                            <Autocomplete
                                multiple
                                disableCloseOnSelect
                                options={allTags}
                                inputValue={inputValue}
                                value={field.value}
                                onInputChange={handleInputChange}
                                getOptionLabel={option => option.name}
                                onChange={(_, newValue) => field.onChange(newValue)}
                                // disable filtering selected options on the client side
                                filterOptions={x => x}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                loading={isLoadingTags}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        error={!!error}
                                        variant="standard"
                                        helperText={error?.message}
                                        placeholder="Start typing to search..."
                                    />
                                )}
                                slotProps={{ listbox: { sx: { maxHeight: isMobile ? "auto" : "250px" } } }}
                            />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" disabled={isPending} onClick={handleSubmit(onValidSubmit)}>
                        {isPending ? <CircularProgress size={24} color="inherit" /> : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>
        </FormFieldShell>
    );
});
