import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { TextField, FormControl } from "@mui/material";
import { MAX_AGE, MIN_AGE, VALIDATE_RELES } from "@app/core/constants/rulesConstants";
import { SIGN_UP_FORM_FIELDS, SignUpFormValues } from "@app/features/auth/signUp/SignUpForm";

export const Age: FC = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext<SignUpFormValues>();
    return (
        <FormControl required>
            <TextField
                required
                fullWidth
                type="number"
                variant="standard"
                autoComplete="age"
                error={!!errors?.age}
                id={SIGN_UP_FORM_FIELDS.age.name}
                label={SIGN_UP_FORM_FIELDS.age.label}
                name={SIGN_UP_FORM_FIELDS.age.name}
                slotProps={{ htmlInput: { min: MIN_AGE, max: MAX_AGE } }}
                placeholder={`You must be at least ${MIN_AGE} years old.`}
                helperText={errors?.age?.message}
                {...register(SIGN_UP_FORM_FIELDS.age.name, {
                    ...VALIDATE_RELES.AGE,
                })}
            />
        </FormControl>
    );
};
