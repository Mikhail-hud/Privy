import { FC } from "react";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import { AuthContainer } from "@app/features/auth/components";
import { SignInForm } from "@app/features/auth/signIn/SignInForm";
import { SIGN_UP_PAGE_PATH } from "@app/core/constants/pathConstants";

export const SignIn: FC = () => (
    <AuthContainer>
        <Typography component="h1" variant="h3">
            Sign In
        </Typography>
        <SignInForm />
        <Divider />
        <Link sx={{ textAlign: "center" }} component={RouterLink} to={SIGN_UP_PAGE_PATH}>
            New here? Sign Up!
        </Link>
    </AuthContainer>
);
