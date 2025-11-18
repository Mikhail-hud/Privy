import { createTheme, Theme } from "@mui/material";
import { colorSchemes, typography } from "@app/core/providers";
import { inputsCustomizations } from "@app/core/providers/ThemeProvider/Customizations";

const defaultBreakpoints = {
    xxs: 0,
    xs: 300,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
};
export const useTheme = (): Theme => {
    return createTheme({
        breakpoints: {
            values: defaultBreakpoints,
        },
        cssVariables: true,
        colorSchemes,
        typography,
        components: {
            ...inputsCustomizations,
        },
    });
};
