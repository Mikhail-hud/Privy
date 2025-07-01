import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { FormLabel, TextField, FormControl } from "@mui/material";
import { isValidEmail, isValidUsername } from "@app/core/utils/authUtils";
import { SignInFormFields, SignInFormValues } from "@app/features/signIn/SignInForm";

export const Identifier: FC = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext<SignInFormValues>();
    return (
        <FormControl required>
            <FormLabel>Identifier</FormLabel>
            <TextField
                autoFocus
                required
                fullWidth
                id="identifier"
                name="identifier"
                variant="outlined"
                error={!!errors.identifier}
                placeholder="Enter your Email or Username"
                helperText={errors.identifier?.message}
                {...register(SignInFormFields.IDENTIFIER, {
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
