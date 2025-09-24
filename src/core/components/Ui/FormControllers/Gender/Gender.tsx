import { ReactElement } from "react";
import Radio from "@mui/material/Radio";
import { UserGender } from "@app/core/services";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup, { RadioGroupProps } from "@mui/material/RadioGroup";
import {
    Path,
    Control,
    Controller,
    FieldValues,
    RegisterOptions,
    ControllerFieldState,
    ControllerRenderProps,
} from "react-hook-form";
import { FormLabel } from "@mui/material";

type GenderProps<T extends FieldValues> = Omit<RadioGroupProps, "name"> & {
    name: Path<T>;
    label?: string;
    control: Control<T>;
    rules?: RegisterOptions<T>;
};

export const GenderFormControl = <T extends FieldValues>({ control, name, label, rules, ...rest }: GenderProps<T>) => (
    <Controller
        name={name}
        control={control}
        render={({
            field,
            fieldState: { error },
        }: {
            field: ControllerRenderProps<T, Path<T>>;
            fieldState: ControllerFieldState;
        }) => (
            <FormControl error={!!error}>
                <FormLabel>{label}</FormLabel>
                <RadioGroup {...field} {...rest} row>
                    <FormControlLabel value={UserGender.MALE} control={<Radio size="small" />} label="Male" />
                    <FormControlLabel value={UserGender.FEMALE} control={<Radio size="small" />} label="Female" />
                    <FormControlLabel value={UserGender.OTHER} control={<Radio size="small" />} label="Other" />
                </RadioGroup>
                {error && <FormHelperText>{error?.message}</FormHelperText>}
            </FormControl>
        )}
    />
);

export const Gender = memo(GenderFormControl) as <T extends FieldValues>(props: GenderProps<T>) => ReactElement;
