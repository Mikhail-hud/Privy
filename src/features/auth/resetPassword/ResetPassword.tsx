import { FC } from "react";
import { Typography, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { AuthContainer } from "@app/features/auth/components";
import { SIGN_IN_PAGE_PATH } from "@app/core/constants/pathConstants";
import { ResetPasswordForm } from "@app/features/auth/resetPassword/ResetPasswordForm";

export const ResetPassword: FC = () => (
    <AuthContainer>
        <Typography component="h1" variant="h3" color="primary">
            Password Recovery
        </Typography>
        <ResetPasswordForm />
        <Link sx={{ textAlign: "center" }} component={RouterLink} to={SIGN_IN_PAGE_PATH} replace>
            Remembered your password?
        </Link>
    </AuthContainer>
);
