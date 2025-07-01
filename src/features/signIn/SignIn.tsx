import { FC } from "react";
import { SignInForm } from "@app/features/signIn/SignInForm";
import { Box, Card, Link, styled, Container, Typography } from "@mui/material";

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
    return (
        <Container sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MuiCard variant="outlined">
                <Typography component="h1" variant="h2">
                    Sign in
                </Typography>
                <SignInForm />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography sx={{ textAlign: "center" }}>
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/material-ui/getting-started/templates/sign-in/"
                            variant="body2"
                            sx={{ alignSelf: "center" }}
                        >
                            Sign up
                        </Link>
                    </Typography>
                </Box>
            </MuiCard>
        </Container>
    );
};
