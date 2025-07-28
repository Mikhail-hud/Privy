import { FC } from "react";
import { TextField, CircularProgress } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { VALIDATE_RELES } from "@app/core/constants/rulesConstants";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import { useLazyCheckUserNameAvailabilityQuery } from "@app/core/services";
import { SIGN_UP_FORM_FIELDS, SignUpFormValues } from "@app/features/auth/signUp/SignUpForm";

export const UserName: FC = () => {
    const [checkUserNameAvailability, { isFetching, isSuccess }] = useLazyCheckUserNameAvailabilityQuery();
    const {
        control,
        formState: { errors, touchedFields },
    } = useFormContext<SignUpFormValues>();

    const fieldName = SIGN_UP_FORM_FIELDS.userName.name;
    const userNameError = errors?.[fieldName];
    const userNameTouched = !!touchedFields?.[fieldName];
    return (
        <Controller
            name={fieldName}
            control={control}
            rules={{
                ...VALIDATE_RELES.USER_NAME,
                validate: async userName => {
                    if (!userName) return true;
                    try {
                        const { isAvailable } = await checkUserNameAvailability({ userName }).unwrap();
                        return isAvailable || "User name is already taken";
                    } catch (error) {
                        return true; // If the request fails, we proseed to sign up to avoid blocking creation account
                    }
                },
            }}
            render={({ field }) => (
                <TextField
                    {...field}
                    autoFocus
                    required
                    fullWidth
                    variant="standard"
                    error={!!userNameError}
                    label={SIGN_UP_FORM_FIELDS.userName.label}
                    helperText={userNameError?.message}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <>
                                    {isFetching && <CircularProgress color="inherit" size={20} />}
                                    {!isFetching && isSuccess && !userNameError && userNameTouched && (
                                        <CheckCircleOutline color="success" />
                                    )}
                                </>
                            ),
                        },
                    }}
                />
            )}
        />
    );
};
