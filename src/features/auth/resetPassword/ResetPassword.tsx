import { FC } from "react";
import { NavigateFunction } from "react-router-dom";
import { SIGN_IN_PAGE_PATH } from "@app/core/constants/pathConstants";
import { Card, styled, Container, Typography, Link } from "@mui/material";
import { ResetPasswordForm } from "@app/features/auth/resetPassword/ResetPasswordForm";

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

export const ResetPassword: FC = () => {
    const navigate: NavigateFunction = useNavigate();
    const handleSignInClick = () => navigate(SIGN_IN_PAGE_PATH, { replace: true });
    return (
        <Container sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MuiCard variant="outlined">
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
            </MuiCard>
        </Container>
    );
};
