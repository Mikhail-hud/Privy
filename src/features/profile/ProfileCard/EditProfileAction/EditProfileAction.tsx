import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { enqueueSnackbar } from "notistack";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { FC, MouseEvent, useState } from "react";
import { QueryError } from "@app/core/interfaces";
import EditIcon from "@mui/icons-material/Edit";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { SubmitHandler, useForm } from "react-hook-form";
import { transformServerErrors } from "@app/core/utils/general";
import { GENERIC_ERROR_MESSAGE } from "@app/core/constants/general";
import { VALIDATE_RELES } from "@app/core/constants/rulesConstants";
import { ProfileUpdatePayload, User, UserGender, useUpdateProfileMutation } from "@app/core/services";
import { BirthDate, Biography, FullName, Gender, Switch, Interests, UserLinks } from "@app/core/components";

export const PROFILE_FORM_FIELDS = {
    gender: { name: "gender", label: "Gender" },
    incognito: { name: "isProfileIncognito", label: "Incognito profile" },
    birthDate: { name: "birthDate", label: "Birthdate" },
    fullName: { name: "fullName", label: "Full Name" },
    email: { name: "email", label: "Email" },
    biography: { name: "biography", label: "Biography" },
} as const;

export interface ProfileFormValues {
    [PROFILE_FORM_FIELDS.gender.name]: UserGender;
    [PROFILE_FORM_FIELDS.incognito.name]: boolean;
    [PROFILE_FORM_FIELDS.birthDate.name]: string | null;
    [PROFILE_FORM_FIELDS.biography.name]: string;
    [PROFILE_FORM_FIELDS.fullName.name]: string;
}

const DEFAULT_SIGN_UP_FORM_VALUES: ProfileFormValues = {
    [PROFILE_FORM_FIELDS.gender.name]: UserGender.OTHER,
    [PROFILE_FORM_FIELDS.incognito.name]: true,
    [PROFILE_FORM_FIELDS.birthDate.name]: null,
    [PROFILE_FORM_FIELDS.fullName.name]: "",
    [PROFILE_FORM_FIELDS.biography.name]: "",
};

interface EditProfileActionProps {
    profile: User;
}

export const EditProfileAction: FC<EditProfileActionProps> = memo(({ profile }) => {
    const [updateProfile, { isLoading, error }] = useUpdateProfileMutation();
    const [open, setOpen] = useState<boolean>(false);

    const values: ProfileFormValues = {
        birthDate: profile?.birthDate ?? null,
        fullName: profile?.fullName ?? "",
        biography: profile?.biography ?? "",
        isProfileIncognito: !!profile?.isProfileIncognito,
        gender: profile?.gender || UserGender.OTHER,
    };

    const form = useForm<ProfileFormValues>({
        mode: "onChange",
        defaultValues: DEFAULT_SIGN_UP_FORM_VALUES,
        errors: transformServerErrors((error as QueryError)?.data?.errors),
    });

    const { handleSubmit, control } = form;

    const handleClickOpen = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        setOpen(true);
        form.reset(values);
    };
    const handleClose = (): void => setOpen(false);

    const onValidSubmit: SubmitHandler<ProfileFormValues> = async data => {
        try {
            await updateProfile(data as ProfileUpdatePayload).unwrap();
            handleClose();
        } catch (error) {
            enqueueSnackbar((error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE, {
                variant: "error",
            });
        }
    };

    return (
        <>
            <IconButton color="primary" size="large" onClick={handleClickOpen}>
                <EditIcon />
            </IconButton>
            <Dialog
                open={open}
                maxWidth="md"
                onClose={handleClose}
                slotProps={{
                    paper: {
                        component: "form",
                        onSubmit: handleSubmit(onValidSubmit),
                    },
                }}
            >
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                    <FullName<ProfileFormValues>
                        control={control}
                        rules={VALIDATE_RELES.FULL_NAME}
                        name={PROFILE_FORM_FIELDS.fullName.name}
                        label={PROFILE_FORM_FIELDS.fullName.label}
                    />
                    <Biography<ProfileFormValues>
                        control={control}
                        rules={VALIDATE_RELES.BIOGRAPHY}
                        name={PROFILE_FORM_FIELDS.biography.name}
                        label={PROFILE_FORM_FIELDS.biography.label}
                    />
                    <Interests interests={profile.interests} />
                    <UserLinks links={profile.links} />
                    <BirthDate<ProfileFormValues>
                        control={control}
                        name={PROFILE_FORM_FIELDS.birthDate.name}
                        label={PROFILE_FORM_FIELDS.birthDate.label}
                    />
                    <Gender<ProfileFormValues>
                        control={control}
                        name={PROFILE_FORM_FIELDS.gender.name}
                        label={PROFILE_FORM_FIELDS.gender.label}
                    />
                    <Divider />
                    <Switch<ProfileFormValues>
                        control={control}
                        name={PROFILE_FORM_FIELDS.incognito.name}
                        label={PROFILE_FORM_FIELDS.incognito.label}
                        description="When this option is enabled, your full name, bio, photos, and links will be hidden from other users. They will only see your @username. You can manually grant access to your profile to select users."
                    />
                </DialogContent>
                <DialogActions sx={{ pb: 3, px: 3 }}>
                    <Button onClick={handleClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button variant="contained" type="submit" loadingPosition="start" loading={isLoading}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
});
