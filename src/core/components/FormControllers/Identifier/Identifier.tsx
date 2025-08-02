import { TextField } from "@mui/material";
import { TextFieldProps } from "@mui/material/TextField";
import {
    Path,
    Control,
    Controller,
    FieldValues,
    ControllerFieldState,
    RegisterOptions,
    ControllerRenderProps,
} from "react-hook-form";
import { ReactElement } from "react";

type IdentifierProps<T extends FieldValues> = Omit<TextFieldProps, "name"> & {
    name: Path<T>;
    label?: string;
    control: Control<T>;
    rules?: RegisterOptions<T>;
};

const IdentifierFormControl = <T extends FieldValues>({ control, rules, name, label, ...rest }: IdentifierProps<T>) => {
    return (
        <Controller
            name={name}
            rules={rules}
            control={control}
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
                    autoFocus
                    required
                    fullWidth
                    name={name}
                    label={label}
                    error={!!error}
                    variant="standard"
                    autoComplete="username"
                    helperText={error?.message}
                    placeholder="Enter your Email or Username"
                />
            )}
        />
    );
};
export const Identifier = memo(IdentifierFormControl) as <T extends FieldValues>(
    props: IdentifierProps<T>
) => ReactElement;
