import { FC } from "react";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import { Link as RouterLink } from "react-router-dom";
import { SignInForm } from "@app/features/auth/signIn/SignInForm";
import { SIGN_UP_PAGE_PATH } from "@app/core/constants/pathConstants";
import { AuthContainer, AuthHeader } from "@app/features/auth/components";

export const SignIn: FC = () => (
    <AuthContainer>
        <AuthHeader title="Sign In" />
        <SignInForm />
        <Divider />
        <Link sx={{ textAlign: "center" }} component={RouterLink} to={SIGN_UP_PAGE_PATH}>
            New here? Sign Up!
        </Link>
    </AuthContainer>
);
