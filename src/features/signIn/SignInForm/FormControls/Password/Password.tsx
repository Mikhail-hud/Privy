import { FC, MouseEvent, useState } from "react";
import { useFormContext } from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { SignInFormFields, SignInFormValues } from "@app/features/signIn/SignInForm";
import { FormLabel, TextField, IconButton, FormControl, InputAdornment } from "@mui/material";

export const Password: FC = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext<SignInFormValues>();

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleClickShowPassword = () => setShowPassword((show: boolean) => !show);

    const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>): void => event.preventDefault();

    return (
        <FormControl required>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
                required
                fullWidth
                id="password"
                name="password"
                variant="outlined"
                placeholder="••••••"
                autoComplete="current-password"
                type={showPassword ? "text" : "password"}
                error={!!errors.password}
                helperText={errors.password?.message}
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
                {...register(SignInFormFields.PASSWORD, {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
            />
        </FormControl>
    );
};
