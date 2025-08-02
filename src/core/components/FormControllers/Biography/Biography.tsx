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

type BiographyProps<T extends FieldValues> = Omit<TextFieldProps, "name"> & {
    name: Path<T>;
    label?: string;
    control: Control<T>;
    rules?: RegisterOptions<T>;
};

export const BiographyFormControl = <T extends FieldValues>({
    control,
    label,
    rules,
    name,
    ...rest
}: BiographyProps<T>) => {
    return (
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
                    multiline
                    type="string"
                    maxRows={10}
                    label={label}
                    variant="standard"
                    error={!!error}
                    helperText={error?.message}
                    placeholder="Share something about yourself"
                />
            )}
        />
    );
};

export const Biography = memo(BiographyFormControl) as <T extends FieldValues>(
    props: BiographyProps<T>
) => ReactElement;
