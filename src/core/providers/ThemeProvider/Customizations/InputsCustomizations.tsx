import { Theme, Components } from "@mui/material/styles";

export const inputsCustomizations: Components<Theme> = {
    MuiOutlinedInput: {
        styleOverrides: {
            input: ({ theme }) => ({
                "&:-webkit-autofill": {
                    WebkitTextFillColor: (theme.vars || theme).palette.text.primary,
                    boxShadow: "none",
                    WebkitBoxShadow: "none",
                    transition: "background-color 9999s ease-in-out 0s",
                },
            }),
        },
    },
    MuiInput: {
        styleOverrides: {
            input: ({ theme }) => ({
                "&:-webkit-autofill": {
                    WebkitTextFillColor: (theme.vars || theme).palette.text.primary,
                    boxShadow: "none",
                    WebkitBoxShadow: "none",
                    transition: "background-color 9999s ease-in-out 0s",
                },
            }),
            underline: ({ theme }) => ({
                "&:before": {
                    borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
                },
                "&:hover:not(.Mui-disabled):before": {
                    borderBottom: `1px solid ${(theme.vars || theme).palette.primary.main}`,
                },
                "&.Mui-focused:after": {
                    borderBottom: `2px solid ${(theme.vars || theme).palette.primary.main}`,
                },
            }),
        },
    },
};
