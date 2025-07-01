import { FC, PropsWithChildren } from "react";
import { useTheme } from "@app/core/providers";
import { CssBaseline, Theme, ThemeProvider } from "@mui/material";

export const AppThemeProvider: FC<PropsWithChildren> = ({ children }) => {
    const theme: Theme = useTheme();
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            {children}
        </ThemeProvider>
    );
};
