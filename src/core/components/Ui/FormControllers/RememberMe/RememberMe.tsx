import Checkbox, { CheckboxProps } from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
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

type RememberMeProps<T extends FieldValues> = Omit<CheckboxProps, "name"> & {
    name: Path<T>;
    label?: string;
    control: Control<T>;
    rules?: RegisterOptions<T>;
};

const RememberMeFormControl = <T extends FieldValues>({ name, label, rules, control, ...rest }: RememberMeProps<T>) => (
    <Controller
        name={name}
        rules={rules}
        control={control}
        render={({ field }: { field: ControllerRenderProps<T, Path<T>>; fieldState: ControllerFieldState }) => (
            <FormControlLabel
                control={<Checkbox {...field} {...rest} checked={!!field.value} color="primary" />}
                label={label}
            />
        )}
    />
);

export const RememberMe = memo(RememberMeFormControl) as <T extends FieldValues>(
    props: RememberMeProps<T>
) => ReactElement;
