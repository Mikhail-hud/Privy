import { FC } from "react";
import { Typography, Link } from "@mui/material";
import { NavigateFunction } from "react-router-dom";
import { AuthContainer } from "@app/features/auth/components";
import { SIGN_IN_PAGE_PATH } from "@app/core/constants/pathConstants";
import { ResetPasswordForm } from "@app/features/auth/resetPassword/ResetPasswordForm";

export const ResetPassword: FC = () => {
    const navigate: NavigateFunction = useNavigate();
    const handleSignInClick = (): void => navigate(SIGN_IN_PAGE_PATH, { replace: true });
    return (
        <AuthContainer>
            <Typography component="h1" variant="h2">
                Password Recovery
            </Typography>
            <ResetPasswordForm />
            <Typography sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                Remembered your password?{" "}
                <Link variant="body2" component="button" onClick={handleSignInClick}>
                    Sign in
                </Link>
            </Typography>
        </AuthContainer>
    );
};
