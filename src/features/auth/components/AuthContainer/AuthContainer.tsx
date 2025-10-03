import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material";
import { FC, PropsWithChildren } from "react";
import Container from "@mui/material/Container";
import { Mark } from "@app/features/auth/components/AuthContainer/Mark";
import { DescriptionContent } from "@app/features/auth/components/AuthContainer/DescriptionContent";

const MuiCard = styled(Card)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    width: "100%",
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    background: "transparent",
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
                py: 2,
                display: "flex",
                minHeight: "100vh",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Stack
                spacing={2}
                direction={{ xs: "column-reverse", md: "row" }}
                sx={{ width: "100%", maxWidth: "1600px", alignItems: "center" }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        width: { xs: "100%", md: "50%" },
                    }}
                >
                    <Mark />
                    <DescriptionContent />
                </Box>
                <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                    <MuiCard variant="outlined">{children}</MuiCard>
                </Box>
            </Stack>
        </Container>
    );
};
