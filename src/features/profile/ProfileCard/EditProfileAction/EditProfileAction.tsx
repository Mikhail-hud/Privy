import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { enqueueSnackbar } from "notistack";
import Divider from "@mui/material/Divider";
import { useIsMobile } from "@app/core/hooks";
import { FC, MouseEvent, useState } from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { SubmitHandler, useForm } from "react-hook-form";
import { transformServerErrors } from "@app/core/utils/general";
import { VALIDATE_RELES } from "@app/core/constants/rulesConstants";
import { BirthDate, TextField, FullName, Gender, Switch, Interests, UserLinks } from "@app/core/components";
import { ProfileUpdatePayload, Profile, UserGender, useUpdateProfileMutation, ApiError } from "@app/core/services";

export const PROFILE_FORM_FIELDS = {
    gender: { name: "gender", label: "Gender" },
    incognito: { name: "isProfileIncognito", label: "Incognito profile" },
    birthDate: { name: "birthDate", label: "Birthdate" },
    fullName: { name: "fullName", label: "Full Name" },
    email: { name: "email", label: "Email" },
    biography: { name: "biography", label: "Biography", placeholder: "Share something about yourself" },
} as const;

export interface ProfileFormValues {
    [PROFILE_FORM_FIELDS.gender.name]: UserGender;
    [PROFILE_FORM_FIELDS.incognito.name]: boolean;
    [PROFILE_FORM_FIELDS.birthDate.name]: string | null;
    [PROFILE_FORM_FIELDS.biography.name]: string;
    [PROFILE_FORM_FIELDS.fullName.name]: string;
}

const DEFAULT_PROFILE_FORM_VALUES: ProfileFormValues = {
    [PROFILE_FORM_FIELDS.gender.name]: UserGender.OTHER,
    [PROFILE_FORM_FIELDS.incognito.name]: true,
    [PROFILE_FORM_FIELDS.birthDate.name]: null,
    [PROFILE_FORM_FIELDS.fullName.name]: "",
    [PROFILE_FORM_FIELDS.biography.name]: "",
};

interface EditProfileActionProps {
    profile: Profile;
}

export const EditProfileAction: FC<EditProfileActionProps> = memo(({ profile }) => {
    const isMobile: boolean = useIsMobile();
    const { mutateAsync: updateProfile, isPending, error } = useUpdateProfileMutation();
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
        defaultValues: DEFAULT_PROFILE_FORM_VALUES,
        errors: transformServerErrors((error as unknown as ApiError)?.errors),
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
            await updateProfile(data as ProfileUpdatePayload);
            handleClose();
        } catch (error) {
            enqueueSnackbar((error as ApiError)?.message, {
                variant: "error",
            });
        }
    };

    return (
        <>
            <Button color="primary" variant="outlined" size={isMobile ? "small" : "medium"} onClick={handleClickOpen}>
                Edit Profile
            </Button>
            <Dialog
                open={open}
                maxWidth="md"
                onClose={handleClose}
                slotProps={{
                    paper: {
                        component: "form",
                        // sx: { width: "100%", maxWidth: 800 },
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
                    <TextField<ProfileFormValues>
                        variant="standard"
                        control={control}
                        rules={VALIDATE_RELES.BIOGRAPHY}
                        name={PROFILE_FORM_FIELDS.biography.name}
                        label={PROFILE_FORM_FIELDS.biography.label}
                        placeholder={PROFILE_FORM_FIELDS.biography.placeholder}
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
                    <Button onClick={handleClose} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button variant="contained" type="submit" loadingPosition="start" loading={isPending}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
});
