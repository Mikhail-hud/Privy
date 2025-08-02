import Card from "@mui/material/Card";
import { styled } from "@mui/material";
import Container from "@mui/material/Container";
import { FC, PropsWithChildren } from "react";

const MuiCard = styled(Card)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    width: "100%",
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: "auto",
    [theme.breakpoints.up("sm")]: {
        maxWidth: "500px",
    },
}));

export const AuthContainer: FC<PropsWithChildren> = ({ children }) => {
    return (
        <Container
            maxWidth={false}
            sx={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right bottom",
                backgroundImage: "url('/src/core/assets/img/common/bg.png')",
            }}
        >
            <MuiCard variant="outlined">{children}</MuiCard>
        </Container>
    );
};
