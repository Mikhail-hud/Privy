import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import { MouseEvent, ReactElement, useState } from "react";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import {
    Path,
    Control,
    FieldValues,
    Controller,
    RegisterOptions,
    ControllerFieldState,
    ControllerRenderProps,
} from "react-hook-form";

type PasswordProps<T extends FieldValues> = Omit<TextFieldProps, "name"> & {
    name: Path<T>;
    label?: string;
    control: Control<T>;
    rules?: RegisterOptions<T>;
};

const PasswordFormControl = <T extends FieldValues>({ name, label, rules, control, ...rest }: PasswordProps<T>) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleClickShowPassword = () => setShowPassword((show: boolean) => !show);

    const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>): void => event.preventDefault();

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
                    required
                    fullWidth
                    name={name}
                    error={!!error}
                    label={label}
                    variant="standard"
                    helperText={error?.message}
                    type={showPassword ? "text" : "password"}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            )}
        />
    );
};

export const Password = memo(PasswordFormControl) as <T extends FieldValues>(props: PasswordProps<T>) => ReactElement;
