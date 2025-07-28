import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { TextField, FormControl } from "@mui/material";
import { isValidEmail, isValidUsername } from "@app/core/utils/authUtils";
import { SIGN_IN_FORM_FIELDS, SignInFormValues } from "@app/features/auth/signIn/SignInForm";

export const Identifier: FC = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext<SignInFormValues>();
    return (
        <FormControl required>
            <TextField
                autoFocus
                required
                fullWidth
                variant="standard"
                autoComplete="username"
                error={!!errors.identifier}
                label={SIGN_IN_FORM_FIELDS.identifier.label}
                id={SIGN_IN_FORM_FIELDS.identifier.name}
                name={SIGN_IN_FORM_FIELDS.identifier.name}
                placeholder="Enter your Email or Username"
                helperText={errors.identifier?.message}
                {...register(SIGN_IN_FORM_FIELDS.identifier.name, {
                    required: "Identifier is required",
                    validate: (value: string) => {
                        if (value.includes("@")) {
                            return isValidEmail(value) || "Wrong email format";
                        }
                        return isValidUsername(value) || "Wrong username format";
                    },
                })}
            />
        </FormControl>
    );
};
