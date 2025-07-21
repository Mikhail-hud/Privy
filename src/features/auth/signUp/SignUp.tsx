import { FC } from "react";
import { Link, Typography } from "@mui/material";
import { NavigateFunction } from "react-router-dom";
import { AuthContainer } from "@app/features/auth/components";
import { SignUpForm } from "@app/features/auth/signUp/SignUpForm";
import { SIGN_IN_PAGE_PATH } from "@app/core/constants/pathConstants";

export const SignUp: FC = () => {
    const navigate: NavigateFunction = useNavigate();
    const handleSignUpClick = (): void => navigate(SIGN_IN_PAGE_PATH);
    return (
        <AuthContainer>
            <Typography component="h1" variant="h3">
                Sign Up
            </Typography>
            <SignUpForm />
            <Link variant="body2" component="button" onClick={handleSignUpClick}>
                Looking to Sign In?
            </Link>
        </AuthContainer>
    );
};
