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
            underline: ({ theme }) => ({
                "&:before": {
                    borderBottom: `1px solid ${theme.palette.divider}`,
                },
                "&:hover:not(.Mui-disabled):before": {
                    borderBottom: `1px solid ${theme.palette.primary.main}`,
                },
            }),
        },
    },
};
