import { FC } from "react";
import { UserContext } from "@app/core/hooks";
import { Navigation } from "@app/core/components";
import { Box, Theme, useTheme } from "@mui/material";
import { Outlet, useLoaderData } from "react-router-dom";

export const AppLayout: FC = () => {
    const theme: Theme = useTheme();
    const { user } = useLoaderData() as UserContext;
    const navWidth: string = `calc(${theme.spacing(7)} + 1px)`;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navigation />
            <Box component="main" sx={{ flexGrow: 1, p: 2, ml: navWidth }}>
                <Outlet context={{ user }} />
            </Box>
        </Box>
    );
};
