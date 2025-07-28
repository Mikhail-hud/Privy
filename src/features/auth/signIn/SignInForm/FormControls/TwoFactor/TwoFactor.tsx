import { MuiOtpInput } from "mui-one-time-password-input";
import { FC, FormEvent, useEffect, useState } from "react";
import { TwoFactorSignInPayload, UserWithTwoFactor } from "@app/core/services";
import { AuthActionData, SIGN_IN_ACTION_KEY, SIGN_IN_WITH_TWO_FACTOR } from "@app/features";
import { Navigation, SubmitFunction, useActionData, useNavigation, useSubmit } from "react-router-dom";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from "@mui/material";

const MUI_OTP_INPUT_LENGTH = 6;

export const TwoFactor: FC = () => {
    const submit: SubmitFunction = useSubmit();
    const navigation: Navigation = useNavigation();
    const actionData = useActionData() as AuthActionData;
    const [open, setOpen] = useState<boolean>(false);
    const [user, setUser] = useState<UserWithTwoFactor | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [twoFactorCode, setTwoFactorCode] = useState<string>("");

    const handleChange = (code: string): void => {
        if (error) setError(null);
        setTwoFactorCode(code);
    };

    const isSubmitting: boolean = navigation.state === "submitting";

    const handleClose = (): void => {
        setUser(null);
        setOpen(false);
        setTwoFactorCode("");
        setError(null);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.stopPropagation();
        event.preventDefault();

        if (twoFactorCode.length < MUI_OTP_INPUT_LENGTH) {
            setError(`Please enter a valid ${MUI_OTP_INPUT_LENGTH}-digit code.`);
            return;
        }
        if (user?.twoFactorRequired && twoFactorCode) {
            const payload: TwoFactorSignInPayload = { twoFactorCode };
            submit({ ...payload, [SIGN_IN_ACTION_KEY]: SIGN_IN_WITH_TWO_FACTOR }, { method: "post" });
        }
    };

    useEffect((): void => {
        if (actionData?.user?.twoFactorRequired) {
            setUser(actionData.user);
            setOpen(true);
            setError(null);
        }
        if (actionData?.twoFactorError) {
            setError(actionData.twoFactorError);
        }
    }, [actionData]);

    return (
        <Dialog open={open} slotProps={{ paper: { component: "form", onSubmit: handleSubmit } }}>
            <DialogTitle variant="h3">Two Factor Authentication</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                <DialogContentText>
                    Please enter the authentication code sent to your registered email address to continue. If you did
                    not receive the code, please check your spam folder or try resending it.
                </DialogContentText>
                <MuiOtpInput
                    autoFocus
                    value={twoFactorCode}
                    onChange={handleChange}
                    length={MUI_OTP_INPUT_LENGTH}
                    TextFieldsProps={{ error: !!error }}
                />
                {error && <DialogContentText color="error">{error}</DialogContentText>}
            </DialogContent>
            <DialogActions sx={{ pb: 3, px: 3 }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" type="submit" loadingPosition="start" loading={isSubmitting}>
                    Continue
                </Button>
            </DialogActions>
        </Dialog>
    );
};
