import TextField, { TextFieldProps } from "@mui/material/TextField";
import { MAX_AGE, MIN_AGE } from "@app/core/constants/rulesConstants";
import {
    Control,
    Path,
    Controller,
    FieldValues,
    RegisterOptions,
    ControllerFieldState,
    ControllerRenderProps,
} from "react-hook-form";
import { ReactElement } from "react";

type AgeProps<T extends FieldValues> = Omit<TextFieldProps, "name"> & {
    name: Path<T>;
    label: string;
    control: Control<T>;
    rules?: RegisterOptions<T>;
};

const AgeFormControl = <T extends FieldValues>({ name, control, rules, label, ...rest }: AgeProps<T>) => (
    <Controller
        control={control}
        rules={rules}
        name={name}
        render={({
            field,
            fieldState: { error },
        }: {
            field: ControllerRenderProps<T, Path<T>>;
            fieldState: ControllerFieldState;
        }) => (
            <TextField
                {...field}
                {...rest}
                required
                fullWidth
                type="number"
                label={label}
                variant="standard"
                error={!!error}
                helperText={error?.message}
                slotProps={{ htmlInput: { min: MIN_AGE, max: MAX_AGE } }}
                placeholder={`Age must be at least ${MIN_AGE} years old.`}
            />
        )}
    />
);

export const Age = memo(AgeFormControl) as <T extends FieldValues>(props: AgeProps<T>) => ReactElement;
