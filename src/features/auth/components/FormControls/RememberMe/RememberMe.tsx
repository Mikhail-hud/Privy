import { Checkbox, FormControlLabel } from "@mui/material";
import { FieldValues, Path, RegisterOptions, useFormContext } from "react-hook-form";

interface RememberMeProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    autoComplete?: string;
    registerOptions?: RegisterOptions<T, Path<T>>;
}

export const RememberMe = <T extends FieldValues>({ name, label, registerOptions }: RememberMeProps<T>) => {
    const { register } = useFormContext<T>();
    return (
        <FormControlLabel control={<Checkbox {...register(name, registerOptions)} color="primary" />} label={label} />
    );
};
