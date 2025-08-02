import { ReactElement } from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import {
    Control,
    Path,
    Controller,
    FieldValues,
    RegisterOptions,
    ControllerFieldState,
    ControllerRenderProps,
} from "react-hook-form";

type EmailProps<T extends FieldValues> = Omit<TextFieldProps, "name"> & {
    name: Path<T>;
    label?: string;
    control: Control<T>;
    rules?: RegisterOptions<T>;
};

const EmailFormControl = <T extends FieldValues>({ control, rules, name, label, ...rest }: EmailProps<T>) => (
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
                type="email"
                label={label}
                error={!!error}
                variant="standard"
                autoComplete="email"
                helperText={error?.message}
                placeholder="Enter your Email"
            />
        )}
    />
);

export const Email = memo(EmailFormControl) as <T extends FieldValues>(props: EmailProps<T>) => ReactElement;
