import { MouseEvent, useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useFormContext, FieldValues, Path, RegisterOptions } from "react-hook-form";
import { FormLabel, TextField, IconButton, FormControl, InputAdornment } from "@mui/material";

interface PasswordProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    autoComplete?: string;
    registerOptions?: RegisterOptions<T, Path<T>>;
}

export const Password = <T extends FieldValues>({
    name,
    label,
    registerOptions,
    autoComplete = "current-password",
}: PasswordProps<T>) => {
    const {
        register,
        formState: { errors },
    } = useFormContext<T>();

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleClickShowPassword = () => setShowPassword((show: boolean) => !show);

    const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>): void => event.preventDefault();

    return (
        <FormControl required>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <TextField
                required
                fullWidth
                id={name}
                name={name}
                variant="outlined"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                autoComplete={autoComplete}
                error={!!errors[name]}
                helperText={errors[name]?.message as string}
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
                {...register(name, registerOptions)}
            />
        </FormControl>
    );
};
