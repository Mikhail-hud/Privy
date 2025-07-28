import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { TextField, FormControl } from "@mui/material";
import { VALIDATE_RELES } from "@app/core/constants/rulesConstants";
import { SIGN_UP_FORM_FIELDS, SignUpFormValues } from "@app/features/auth/signUp/SignUpForm";

export const Biography: FC = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext<SignUpFormValues>();
    return (
        <FormControl>
            <TextField
                fullWidth
                type="string"
                multiline
                maxRows={10}
                variant="standard"
                autoComplete="biography"
                error={!!errors?.fullName}
                placeholder="Share something about yourself"
                id={SIGN_UP_FORM_FIELDS.biography.name}
                label={SIGN_UP_FORM_FIELDS.biography.label}
                name={SIGN_UP_FORM_FIELDS.biography.name}
                helperText={errors?.biography?.message}
                {...register(SIGN_UP_FORM_FIELDS.biography.name, {
                    ...VALIDATE_RELES.BIOGRAPHY,
                })}
            />
        </FormControl>
    );
};
