import { FC } from "react";
import Box from "@mui/material/Box";
import { UserContext } from "@app/features";
import { Outlet, useLoaderData } from "react-router-dom";
import { LabelBottomNavigation, TopBar } from "@app/core/components";

export const AppLayout: FC = () => {
    const { user } = useLoaderData() as UserContext;
    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", gap: 1 }}>
            <TopBar />
            <Box component="main" sx={{ flexGrow: 1 }}>
                <Outlet context={{ user }} />
            </Box>
            <LabelBottomNavigation />
        </Box>
    );
};
