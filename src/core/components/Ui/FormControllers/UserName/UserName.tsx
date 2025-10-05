import { debounce } from "@mui/material/utils";
import { QueryError } from "@app/core/interfaces";
import CircularProgress from "@mui/material/CircularProgress";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import { useLazyCheckUserNameAvailabilityQuery } from "@app/core/services";
import { DEBOUNCE_DELAY, GENERIC_ERROR_MESSAGE } from "@app/core/constants/general";
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

type UserNameProps<T extends FieldValues> = Omit<TextFieldProps, "name"> & {
    name: Path<T>;
    label?: string;
    control: Control<T>;
    rules?: RegisterOptions<T>;
};

const UserNameFormControl = <T extends FieldValues>({ control, name, label, rules, ...rest }: UserNameProps<T>) => {
    const [checkUserNameAvailability, { isFetching, data }] = useLazyCheckUserNameAvailabilityQuery();

    const validationCache = useRef<Record<string, boolean | string>>({});
    const cache = validationCache.current;

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
                const errorMessage: string = (error as QueryError)?.data?.errors?.[name] || GENERIC_ERROR_MESSAGE;
                cache[userName] = errorMessage;
                resolve(errorMessage);
            }
        };
        return debounce(validate, DEBOUNCE_DELAY);
    }, [checkUserNameAvailability, name, cache]);

    return (
        <Controller
            control={control}
            name={name}
            rules={{
                ...rules,
                validate: async userName => {
                    if (!userName) return true;
                    return new Promise(resolve => {
                        validate(userName, resolve);
                    });
                },
            }}
            render={({
                field,
                fieldState: { error, isTouched },
            }: {
                field: ControllerRenderProps<T, Path<T>>;
                fieldState: ControllerFieldState;
            }) => (
                <TextField
                    {...field}
                    {...rest}
                    autoFocus
                    required
                    fullWidth
                    variant="standard"
                    error={!!error}
                    helperText={error?.message}
                    label={label}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <>
                                    {isFetching && <CircularProgress color="inherit" size={20} />}
                                    {!isFetching && !!data?.isAvailable && !error && isTouched && (
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

export const UserName = memo(UserNameFormControl) as <T extends FieldValues>(props: UserNameProps<T>) => ReactElement;
