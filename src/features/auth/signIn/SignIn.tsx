import { FC } from "react";
import { NavigateFunction } from "react-router-dom";
import { Divider, Link, Typography } from "@mui/material";
import { AuthContainer } from "@app/features/auth/components";
import { SignInForm } from "@app/features/auth/signIn/SignInForm";
import { SIGN_UP_PAGE_PATH } from "@app/core/constants/pathConstants";

export const SignIn: FC = () => {
    const navigate: NavigateFunction = useNavigate();
    const handleSignUpClick = (): void => navigate(SIGN_UP_PAGE_PATH);
    return (
        <AuthContainer>
            <Typography component="h1" variant="h3">
                Sign In.
            </Typography>
            <SignInForm />
            <Divider />
            <Link variant="body2" component="button" onClick={handleSignUpClick}>
                New here? Sign Up!
            </Link>
        </AuthContainer>
    );
};
