import { FC } from "react";
import { debounce } from "@mui/material/utils";
import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";
import { GENERIC_ERROR_MESSAGE } from "@app/core/constants/general";
import { VALIDATE_RELES } from "@app/core/constants/rulesConstants";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import { useLazyCheckUserNameAvailabilityQuery } from "@app/core/services";
import { SIGN_UP_FORM_FIELDS, SignUpFormValues } from "@app/features/auth/signUp/SignUpForm";

const DEBOUNCE_DELAY = 500;

export const UserName: FC = () => {
    const [checkUserNameAvailability, { isFetching, data }] = useLazyCheckUserNameAvailabilityQuery();
    const {
        control,
        formState: { errors, touchedFields },
    } = useFormContext<SignUpFormValues>();

    const validationCache = useRef<Record<string, boolean | string>>({});
    const cache = validationCache.current;

    const fieldName = SIGN_UP_FORM_FIELDS.userName.name;
    const userNameError = errors?.[fieldName];
    const userNameTouched = !!touchedFields?.[fieldName];
    const showSuccessIcon = !isFetching && data?.isAvailable && !userNameError && userNameTouched;

    const validate = useMemo(() => {
        const validate = async (userName: string, resolve: (value: boolean | string) => void): Promise<void> => {
            if (cache[userName]) {
                return resolve(cache[userName]);
            }
            try {
                const { isAvailable } = await checkUserNameAvailability({ userName }).unwrap();
                const result = isAvailable || "This username is already taken";
                cache[userName] = result;
                resolve(result);
            } catch (error) {
                const errorMessage = error?.data?.errors?.[SIGN_UP_FORM_FIELDS.userName.name] || GENERIC_ERROR_MESSAGE;
                cache[userName] = errorMessage;
                resolve(errorMessage);
            }
        };
        return debounce(validate, DEBOUNCE_DELAY);
    }, [checkUserNameAvailability]);

    return (
        <Controller
            name={fieldName}
            control={control}
            rules={{
                ...VALIDATE_RELES.USER_NAME,
                validate: async userName => {
                    if (!userName) return true;
                    return new Promise(resolve => {
                        validate(userName, resolve);
                    });
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
                    helperText={userNameError?.message}
                    label={SIGN_UP_FORM_FIELDS.userName.label}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <>
                                    {isFetching && <CircularProgress color="inherit" size={20} />}
                                    {showSuccessIcon && <CheckCircleOutline color="success" />}
                                </>
                            ),
                        },
                    }}
                />
            )}
        />
    );
};
