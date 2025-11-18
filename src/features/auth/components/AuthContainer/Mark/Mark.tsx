import { FC } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export const Mark: FC = () => {
    return (
        <Stack
            spacing={2}
            direction="row"
            alignItems="center"
            justifyContent="left"
            sx={{ width: "100%", mb: 2, display: { xxs: "none", md: "flex" } }}
        >
            <Box
                alt="logo"
                component="img"
                src="/src/core/assets/img/common/bg.png"
                sx={{ height: { xxs: 75, md: "20vh" }, width: "auto" }}
            />
            <Typography component="h1" variant="h3" sx={{ color: "primary.main" }}>
                Welcome to Your Private Space
            </Typography>
        </Stack>
    );
};
