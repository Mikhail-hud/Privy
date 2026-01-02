import { ReactElement } from "react";
import {
    Control,
    Path,
    Controller,
    FieldValues,
    RegisterOptions,
    ControllerFieldState,
    ControllerRenderProps,
} from "react-hook-form";
import { Box, FormLabel } from "@mui/material";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import MaterialSwitch, { SwitchProps as MaterialSwitchProps } from "@mui/material/Switch";

type SwitchProps<T extends FieldValues> = Omit<MaterialSwitchProps, "name"> & {
    name: Path<T>;
    label?: string;
    control: Control<T>;
    description?: string;
    rules?: RegisterOptions<T>;
};

const SwitchFormControl = <T extends FieldValues>({
    name,
    label,
    rules,
    control,
    description,
    ...rest
}: SwitchProps<T>) => (
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
            <FormControl error={!!error} sx={{ width: "100%" }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Box sx={{ pr: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                        <FormLabel>{label}</FormLabel>
                        {description && <Typography variant="body2">{description}</Typography>}
                    </Box>
                    <MaterialSwitch {...field} {...rest} checked={!!field.value} />
                </Box>
                {error && <FormHelperText>{error?.message}</FormHelperText>}
            </FormControl>
        )}
    />
);

export const Switch = memo(SwitchFormControl) as <T extends FieldValues>(props: SwitchProps<T>) => ReactElement;
