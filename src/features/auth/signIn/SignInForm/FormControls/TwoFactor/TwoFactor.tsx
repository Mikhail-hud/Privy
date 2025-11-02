import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { useAuth } from "@app/core/hooks";
import { AuthActionData } from "@app/features";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { MuiOtpInput } from "mui-one-time-password-input";
import { FC, FormEvent, useEffect, useState } from "react";
import DialogContentText from "@mui/material/DialogContentText";
import { Navigation, useActionData, useNavigation } from "react-router-dom";

const MUI_OTP_INPUT_LENGTH = 6;

export const TwoFactor: FC = () => {
    const { signInWithTwoFactor } = useAuth();
    const navigation: Navigation = useNavigation();
    const actionData = useActionData() as AuthActionData;
    const [open, setOpen] = useState<boolean>(false);
    const [isTwoFactorRequired, seIsTwoFactorRequired] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [twoFactorCode, setTwoFactorCode] = useState<string>("");

    const handleChange = (code: string): void => {
        if (error) setError(null);
        setTwoFactorCode(code);
    };

    const isSubmitting: boolean = navigation.state === "submitting";

    const handleClose = (): void => {
        seIsTwoFactorRequired(false);
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
        if (isTwoFactorRequired && twoFactorCode) {
            signInWithTwoFactor({ twoFactorCode });
        }
    };

    useEffect((): void => {
        if (actionData?.twoFactorRequired) {
            seIsTwoFactorRequired(actionData?.twoFactorRequired);
            setOpen(true);
            setError(null);
        }
        if (actionData?.twoFactorError) {
            setError(actionData.twoFactorError);
        }
    }, [actionData]);

    return (
        <Dialog open={open} slotProps={{ paper: { component: "form", onSubmit: handleSubmit } }}>
            <DialogTitle variant="h3" color="primary">
                Two Factor Authentication
            </DialogTitle>
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
