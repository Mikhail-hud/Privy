import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { Checkbox, FormControlLabel } from "@mui/material";
import { SignInFormFields, SignInFormValues } from "@app/features/signIn/SignInForm";

export const RememberMe: FC = () => {
    const { register } = useFormContext<SignInFormValues>();
    return (
        <FormControlLabel
            control={<Checkbox {...register(SignInFormFields.REMEMBER_ME)} color="primary" />}
            label="Remember me"
        />
    );
};
