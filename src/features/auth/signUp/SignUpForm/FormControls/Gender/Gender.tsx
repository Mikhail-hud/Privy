import { FC } from "react";
import { UserGender } from "@app/core/services";
import { Controller, useFormContext } from "react-hook-form";
import { SIGN_UP_FORM_FIELDS, SignUpFormValues } from "@app/features/auth/signUp/SignUpForm";
import { FormControl, RadioGroup, FormControlLabel, Radio, FormHelperText } from "@mui/material";

export const Gender: FC = () => {
    const {
        control,
        formState: { errors },
    } = useFormContext<SignUpFormValues>();
    const genderError = errors[SIGN_UP_FORM_FIELDS.gender.name];
    return (
        <FormControl error={!!genderError}>
            <Controller
                name={SIGN_UP_FORM_FIELDS.gender.name}
                control={control}
                render={({ field }) => (
                    <RadioGroup {...field} row>
                        <FormControlLabel value={UserGender.FEMALE} control={<Radio size="small" />} label="Female" />
                        <FormControlLabel value={UserGender.MALE} control={<Radio size="small" />} label="Male" />
                        <FormControlLabel value={UserGender.OTHER} control={<Radio size="small" />} label="Other" />
                    </RadioGroup>
                )}
            />
            {genderError && <FormHelperText>{genderError?.message}</FormHelperText>}
        </FormControl>
    );
};
