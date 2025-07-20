import { FC } from "react";
import { NavigateFunction } from "react-router-dom";
import { SignInForm } from "@app/features/auth/signIn/SignInForm";
import { SIGN_UP_PAGE_PATH } from "@app/core/constants/pathConstants";
import { Card, Link, styled, Container, Typography } from "@mui/material";

const MuiCard = styled(Card)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    width: "100%",
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: "auto",
    [theme.breakpoints.up("sm")]: {
        maxWidth: "450px",
    },
}));

export const SignIn: FC = () => {
    const navigate: NavigateFunction = useNavigate();
    const handleSignUpClick = () => navigate(SIGN_UP_PAGE_PATH, { replace: true });
    return (
        <Container sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MuiCard variant="outlined">
                <Typography component="h1" variant="h2">
                    Sign in
                </Typography>
                <SignInForm />
                <Typography sx={{ textAlign: "center", display: "flex", justifyContent: "center", gap: 1 }}>
                    Don&apos;t have an account?{" "}
                    <Link variant="body2" component="button" onClick={handleSignUpClick}>
                        Sign up
                    </Link>
                </Typography>
            </MuiCard>
        </Container>
    );
};
