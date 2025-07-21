import { Theme, Components } from "@mui/material/styles";

export const inputsCustomizations: Components<Theme> = {
    MuiOutlinedInput: {
        styleOverrides: {
            input: ({ theme }) => ({
                "&:-webkit-autofill": {
                    WebkitTextFillColor: (theme.vars || theme).palette.text.primary,
                    boxShadow: `0 0 0 100px ${(theme.vars || theme).palette.background.paper} inset`,
                },
            }),
        },
    },
    MuiInput: {
        styleOverrides: {
            input: ({ theme }) => ({
                "&:-webkit-autofill": {
                    WebkitTextFillColor: (theme.vars || theme).palette.text.primary,
                    boxShadow: `0 0 0 100px ${(theme.vars || theme).palette.background.paper} inset`,
                },
            }),
        },
    },
};
