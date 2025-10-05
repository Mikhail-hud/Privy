import { FC } from "react";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import { SignUpForm } from "@app/features/auth/signUp/SignUpForm";
import { SIGN_IN_PAGE_PATH } from "@app/core/constants/pathConstants";
import { AuthContainer, AuthHeader } from "@app/features/auth/components";

export const SignUp: FC = () => (
    <AuthContainer>
        <AuthHeader title="Sign Up" />
        <SignUpForm />
        <Link sx={{ textAlign: "center" }} component={RouterLink} to={SIGN_IN_PAGE_PATH}>
            Looking to Sign In?
        </Link>
    </AuthContainer>
);
