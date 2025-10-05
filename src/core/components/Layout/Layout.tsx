import { FC } from "react";
import Box from "@mui/material/Box";
import { useAuth } from "@app/core/hooks";
import { UserContext } from "@app/features";
import { LabelBottomNavigation, TopBar } from "@app/core/components";
import { NavigateFunction, Outlet, useLoaderData, useNavigate } from "react-router-dom";

export const AppLayout: FC = () => {
    const { profile, signOut } = useAuth();
    const { user } = useLoaderData() as UserContext;

    // For some reason, useNavigate is not memoized by React Router
    const navigate: NavigateFunction = useNavigate();

    // To prevent TopBar re-renders, use useCallback to memoize the function
    const handleMenuItemClick = useCallback((key: string) => (): void => navigate(key), [navigate]);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", gap: 1 }}>
            <TopBar profile={profile} signOut={signOut} onAccountMenuItemClick={handleMenuItemClick} />
            <Box component="main" sx={{ flexGrow: 1 }}>
                <Outlet context={{ user }} />
            </Box>
            <LabelBottomNavigation />
        </Box>
    );
};
