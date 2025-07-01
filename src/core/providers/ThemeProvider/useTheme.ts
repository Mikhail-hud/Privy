import { createTheme, Theme } from "@mui/material";
import { colorSchemes, typography } from "@app/core/providers";
import { inputsCustomizations } from "@app/core/providers/ThemeProvider/Customizations";

export const useTheme = (): Theme => {
    return createTheme({
        colorSchemes,
        typography,
        components: {
            ...inputsCustomizations,
        },
    });
};
