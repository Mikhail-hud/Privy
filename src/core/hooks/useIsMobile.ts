import { useTheme, useMediaQuery, Theme } from "@mui/material";

export const useIsMobile = (): boolean => {
    const theme: Theme = useTheme();
    return useMediaQuery(theme.breakpoints.down("sm"));
};
