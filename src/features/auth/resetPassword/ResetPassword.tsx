import { FC } from "react";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import { SIGN_IN_PAGE_PATH } from "@app/core/constants/pathConstants";
import { AuthContainer, AuthHeader } from "@app/features/auth/components";
import { ResetPasswordForm } from "@app/features/auth/resetPassword/ResetPasswordForm";

export const ResetPassword: FC = () => (
    <AuthContainer>
        <AuthHeader title="Password Recovery" />
        <ResetPasswordForm />
        <Link sx={{ textAlign: "center" }} component={RouterLink} to={SIGN_IN_PAGE_PATH} replace>
            Remembered your password?
        </Link>
    </AuthContainer>
);
