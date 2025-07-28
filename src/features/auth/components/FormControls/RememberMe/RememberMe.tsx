import { Checkbox, FormControlLabel } from "@mui/material";
import { Control, Controller, FieldValues, Path, RegisterOptions } from "react-hook-form";

interface RememberMeProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    control: Control<T>;
    rules?: RegisterOptions<T>;
}

export const RememberMe = <T extends FieldValues>({ name, label, rules, control }: RememberMeProps<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field }) => (
                <FormControlLabel
                    control={<Checkbox {...field} checked={!!field.value} color="primary" />}
                    label={label}
                />
            )}
        />
    );
};
