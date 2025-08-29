import { FC } from "react";
import { Box } from "@mui/material";
import { UserContext } from "@app/core/hooks";
import { Outlet, useLoaderData } from "react-router-dom";
import { LabelBottomNavigation, TopBar } from "@app/core/components";

export const AppLayout: FC = () => {
    const { user } = useLoaderData() as UserContext;
    return (
        <>
            <TopBar />
            <Box component="main" sx={{ mb: 8 }}>
                <Outlet context={{ user }} />
            </Box>
            <LabelBottomNavigation />
        </>
    );
};
