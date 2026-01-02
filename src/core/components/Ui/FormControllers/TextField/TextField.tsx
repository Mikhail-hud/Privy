import MUITextField, { TextFieldProps } from "@mui/material/TextField";
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

type TextFieldControlProps<T extends FieldValues> = Omit<TextFieldProps, "name"> & {
    name: Path<T>;
    label?: string;
    control: Control<T>;
    rules?: RegisterOptions<T>;
};

const TextFieldFormControl = <T extends FieldValues>({
    control,
    label,
    rules,
    name,
    ...rest
}: TextFieldControlProps<T>) => {
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
                <MUITextField
                    {...field}
                    {...rest}
                    fullWidth
                    multiline
                    type="string"
                    label={label}
                    error={!!error}
                    helperText={error?.message}
                />
            )}
        />
    );
};

export const TextField = memo(TextFieldFormControl) as <T extends FieldValues>(
    props: TextFieldControlProps<T>
) => ReactElement;
