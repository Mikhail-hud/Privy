import { Provider } from "react-redux";
import { store } from "@app/core/store";
import { SnackbarProvider } from "notistack";
import { FC, PropsWithChildren } from "react";
import { AppThemeProvider } from "@app/core/providers";

export const AppProviders: FC<PropsWithChildren> = ({ children }) => {
    return (
        <AppThemeProvider>
            <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
                <Provider store={store}>{children}</Provider>
            </SnackbarProvider>
        </AppThemeProvider>
    );
};
