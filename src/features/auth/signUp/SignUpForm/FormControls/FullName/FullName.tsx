import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { TextField, FormControl } from "@mui/material";
import { VALIDATE_RELES } from "@app/core/constants/rulesConstants";
import { SIGN_UP_FORM_FIELDS, SignUpFormValues } from "@app/features/auth/signUp/SignUpForm";

export const FullName: FC = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext<SignUpFormValues>();
    return (
        <FormControl>
            <TextField
                fullWidth
                type="string"
                variant="standard"
                autoComplete="full-name"
                error={!!errors?.fullName}
                placeholder="Enter Full Name"
                id={SIGN_UP_FORM_FIELDS.fullName.name}
                label={SIGN_UP_FORM_FIELDS.fullName.label}
                name={SIGN_UP_FORM_FIELDS.fullName.name}
                helperText={errors?.fullName?.message}
                {...register(SIGN_UP_FORM_FIELDS.fullName.name, {
                    ...VALIDATE_RELES.FULL_NAME,
                })}
            />
        </FormControl>
    );
};
