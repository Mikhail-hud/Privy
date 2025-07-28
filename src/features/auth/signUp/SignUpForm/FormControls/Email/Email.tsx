import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { TextField, FormControl } from "@mui/material";
import { VALIDATE_RELES } from "@app/core/constants/rulesConstants";
import { SIGN_UP_FORM_FIELDS, SignUpFormValues } from "@app/features/auth/signUp/SignUpForm";

export const Email: FC = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext<SignUpFormValues>();
    return (
        <FormControl required>
            <TextField
                required
                fullWidth
                type="email"
                variant="standard"
                autoComplete="email"
                error={!!errors?.email}
                placeholder="Enter your Email"
                id={SIGN_UP_FORM_FIELDS.email.name}
                label={SIGN_UP_FORM_FIELDS.email.label}
                name={SIGN_UP_FORM_FIELDS.email.name}
                helperText={errors?.email?.message}
                {...register(SIGN_UP_FORM_FIELDS.email.name, {
                    ...VALIDATE_RELES.EMAIL,
                })}
            />
        </FormControl>
    );
};
