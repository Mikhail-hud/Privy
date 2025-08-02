import TextField, { TextFieldProps } from "@mui/material/TextField";

import {
    Path,
    Control,
    Controller,
    FieldValues,
    RegisterOptions,
    ControllerFieldState,
    ControllerRenderProps,
} from "react-hook-form";
import { ReactElement } from "react";

type FullNameProps<T extends FieldValues> = Omit<TextFieldProps, "name"> & {
    name: Path<T>;
    label?: string;
    control: Control<T>;
    rules?: RegisterOptions<T>;
};

const FullNameFormControl = <T extends FieldValues>({ control, name, rules, label, ...rest }: FullNameProps<T>) => (
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
                fullWidth
                type="string"
                label={label}
                error={!!error}
                variant="standard"
                helperText={error?.message}
                placeholder="Enter Full Name"
            />
        )}
    />
);

export const FullName = memo(FullNameFormControl) as <T extends FieldValues>(props: FullNameProps<T>) => ReactElement;
