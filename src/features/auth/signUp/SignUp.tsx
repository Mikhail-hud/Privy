import { FC } from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import { AuthContainer } from "@app/features/auth/components";
import { SignUpForm } from "@app/features/auth/signUp/SignUpForm";
import { SIGN_IN_PAGE_PATH } from "@app/core/constants/pathConstants";

export const SignUp: FC = () => (
    <AuthContainer>
        <Typography component="h1" variant="h3" color="primary">
            Sign Up
        </Typography>
        <SignUpForm />
        <Link sx={{ textAlign: "center" }} component={RouterLink} to={SIGN_IN_PAGE_PATH}>
            Looking to Sign In?
        </Link>
    </AuthContainer>
);
