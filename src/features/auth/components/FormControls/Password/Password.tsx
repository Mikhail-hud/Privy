import { MouseEvent, useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Control, FieldValues, Path, RegisterOptions, useController } from "react-hook-form";
import { FormLabel, TextField, IconButton, FormControl, InputAdornment } from "@mui/material";

interface PasswordProps<T extends FieldValues = FieldValues> {
    name: Path<T>;
    label: string;
    rules?: RegisterOptions<T>;
    control: Control<T>;
    autoComplete?: string;
}

export const Password = <T extends FieldValues>({ name, label, rules, control, autoComplete }: PasswordProps<T>) => {
    const {
        field,
        fieldState: { error },
    } = useController({ name, control, rules });

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleClickShowPassword = () => setShowPassword((show: boolean) => !show);

    const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>): void => event.preventDefault();

    return (
        <FormControl required>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <TextField
                {...field}
                required
                fullWidth
                id={name}
                name={name}
                error={!!error}
                variant="outlined"
                placeholder="••••••••"
                autoComplete={autoComplete}
                helperText={error?.message}
                type={showPassword ? "text" : "password"}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
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
        </FormControl>
    );
};
