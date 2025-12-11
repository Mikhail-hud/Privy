import { SnackbarProvider } from "notistack";
import { FC, PropsWithChildren } from "react";
import { queryClient } from "@app/core/services";
import { AppThemeProvider } from "@app/core/providers";
import { QueryClientProvider } from "@tanstack/react-query";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export const AppProviders: FC<PropsWithChildren> = ({ children }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <AppThemeProvider>
                <QueryClientProvider client={queryClient}>
                    <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
                        {children}
                    </SnackbarProvider>
                    {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
                </QueryClientProvider>
            </AppThemeProvider>
        </LocalizationProvider>
    );
};
