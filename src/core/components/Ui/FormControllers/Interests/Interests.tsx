import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import { enqueueSnackbar } from "notistack";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import { QueryError } from "@app/core/interfaces";
import { useState, FC, SyntheticEvent } from "react";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import DialogContentText from "@mui/material/DialogContentText";
import { transformServerErrors } from "@app/core/utils/general.ts";
import { GENERIC_ERROR_MESSAGE } from "@app/core/constants/general";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Autocomplete, { AutocompleteInputChangeReason } from "@mui/material/Autocomplete";
import { useGetTagsQuery, useUpdateProfileInterestsMutation, User, Tag } from "@app/core/services";

const InputBox = styled(Box)(({ theme }) => ({
    borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    flexWrap: "wrap",
    minHeight: 32,
    gap: theme.spacing(0.5),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    "&:hover": {
        borderColor: (theme.vars || theme).palette.primary.main,
    },
}));

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
    profile: User | undefined;
}

export const Interests: FC<InterestsProps> = ({ profile }) => {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState<string>("");

    const { data: allTags = [], isLoading: isLoadingTags } = useGetTagsQuery(
        { name: inputValue },
        { skip: !open || !inputValue }
    );
    const [updateInterests, { isLoading: isUpdating, error }] = useUpdateProfileInterestsMutation();

    const { control, handleSubmit, reset } = useForm<InterestsValues>({
        defaultValues: INTERESTS_FORM_FIELDS_VALUES,
        errors: transformServerErrors((error as QueryError)?.data?.errors),
    });

    const handleOpen = (): void => {
        reset({ interests: profile?.interests || [] });
        setInputValue("");
        setOpen(true);
    };

    const handleClose = (): void => setOpen(false);

    const onValidSubmit: SubmitHandler<InterestsValues> = async data => {
        try {
            const tagIds: number[] = data.interests.map(tag => tag.id);
            await updateInterests({ interests: tagIds }).unwrap();
            enqueueSnackbar("Interests have been updated", { variant: "success" });
            handleClose();
        } catch (error) {
            enqueueSnackbar((error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE, {
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
        <FormControl variant="standard" fullWidth>
            <InputLabel shrink sx={{ position: "relative" }}>
                {INTERESTS_FORM_FIELDS.interests.label}
            </InputLabel>
            <InputBox onClick={handleOpen}>
                {profile?.interests?.length ? (
                    profile.interests.map(interest => <Chip key={interest.id} label={interest.name} size="small" />)
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        Select interests so that we can select relevant content and people for you
                    </Typography>
                )}
            </InputBox>
            <Dialog
                open={open}
                maxWidth={false}
                onClose={handleClose}
                sx={{ margin: "auto", maxWidth: 850 }}
                slotProps={{ paper: { component: "form" } }}
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
                                slotProps={{ listbox: { sx: { maxHeight: "250px" } } }}
                            />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" disabled={isUpdating} onClick={handleSubmit(onValidSubmit)}>
                        {isUpdating ? <CircularProgress size={24} color="inherit" /> : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>
        </FormControl>
    );
};
