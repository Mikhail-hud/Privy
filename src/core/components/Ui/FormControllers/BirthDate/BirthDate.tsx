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
import dayjs, { Dayjs } from "dayjs";
import { useTheme } from "@mui/material/styles";
import { DatePickerProps } from "@mui/x-date-pickers";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { ISO_8601_YYYY_MM_DD_FORMAT, MIN_AGE, VALIDATE_RELES } from "@app/core/constants/rulesConstants.ts";

type BirthDateProps<T extends FieldValues> = Omit<DatePickerProps, "value" | "onChange" | "renderInput"> & {
    name: Path<T>;
    label: string;
    control: Control<T>;
    rules?: RegisterOptions<T>;
};

const BirthDateFormControl = <T extends FieldValues>({ name, control, rules, ...rest }: BirthDateProps<T>) => {
    const theme = useTheme();
    return (
        <Controller
            control={control}
            name={name}
            rules={{
                ...rules,
                ...VALIDATE_RELES.BIRTHDATE,
                validate: selectedDate => {
                    const age = dayjs().diff(selectedDate, "year");
                    if (age < MIN_AGE) {
                        return `You must be at least ${MIN_AGE} years old.`;
                    }
                    return true;
                },
            }}
            render={({
                field,
                fieldState: { error },
            }: {
                field: ControllerRenderProps<T, Path<T>>;
                fieldState: ControllerFieldState;
            }) => (
                <MobileDatePicker
                    {...field}
                    format={ISO_8601_YYYY_MM_DD_FORMAT}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(newValue: Dayjs | null) => {
                        field.onChange(newValue ? newValue.format(ISO_8601_YYYY_MM_DD_FORMAT) : null);
                    }}
                    {...rest}
                    slotProps={{
                        textField: {
                            required: true,
                            fullWidth: true,
                            variant: "standard",
                            error: !!error,
                            helperText: error?.message,
                            InputProps: {
                                sx: {
                                    // Fix for MUI issue with date picker underlined
                                    "&:before": {
                                        borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
                                    },
                                    "&:hover:not(.Mui-disabled):before": {
                                        borderBottom: `1px solid ${(theme.vars || theme).palette.primary.main}`,
                                    },
                                    "&.Mui-focused:after": {
                                        borderBottom: `2px solid ${(theme.vars || theme).palette.primary.main}`,
                                    },
                                },
                            },
                        },
                    }}
                />
            )}
        />
    );
};

export const BirthDate = memo(BirthDateFormControl) as <T extends FieldValues>(
    props: BirthDateProps<T>
) => ReactElement;
