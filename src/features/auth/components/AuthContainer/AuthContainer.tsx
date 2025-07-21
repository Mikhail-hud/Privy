import { FC, PropsWithChildren } from "react";
import { Card, Container, styled } from "@mui/material";

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

export const AuthContainer: FC<PropsWithChildren> = ({ children }) => {
    return (
        <Container sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MuiCard variant="outlined">{children}</MuiCard>
        </Container>
    );
};
