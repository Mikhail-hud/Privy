import { FC, PropsWithChildren } from "react";
import { Card, Container, styled } from "@mui/material";

const MuiCard = styled(Card)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    width: "100%",
    // boxShadow: `0px 0px 0px  ${brand[400]}, 0px 0px 300px ${brand[300]}`,
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: "auto",
    [theme.breakpoints.up("sm")]: {
        maxWidth: "500px",
    },
}));

export const AuthContainer: FC<PropsWithChildren> = ({ children }) => {
    return (
        <Container sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MuiCard variant="outlined">{children}</MuiCard>
        </Container>
    );
};
