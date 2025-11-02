import { Theme, Components } from "@mui/material/styles";

export const inputsCustomizations: Components<Theme> = {
    MuiCssBaseline: {
        styleOverrides: {
            "@keyframes slideUp": {
                from: { transform: "translateY(100%)" },
                to: { transform: "translateY(0)" },
            },
        },
    },
    MuiDialog: {
        styleOverrides: {
            paper: ({ theme }) => ({
                [theme.breakpoints.down("sm")]: {
                    margin: 0,
                    width: "100vw",
                    maxWidth: "100vw",
                    maxHeight: "90vh",
                    bottom: 0,
                    position: "fixed",
                    borderRadius: "10px 10px 0 0",
                    boxShadow: theme.shadows[10],
                    animation: `slideUp 0.2s ease-out`,
                },
            }),
        },
    },
    MuiDialogTitle: {
        styleOverrides: {
            root: ({ theme }) => ({
                [theme.breakpoints.down("sm")]: {
                    fontSize: "1.3rem",
                    padding: theme.spacing(1, 2),
                },
            }),
        },
    },
    MuiDialogContent: {
        styleOverrides: {
            root: ({ theme }) => ({
                [theme.breakpoints.down("sm")]: {
                    padding: theme.spacing(1.5, 2),
                },
            }),
        },
    },
    MuiTabs: {
        styleOverrides: {
            list: ({ theme }) => ({
                "& .MuiTab-root": {
                    [theme.breakpoints.down("sm")]: {
                        padding: theme.spacing(0.5),
                        fontSize: "0.8rem",
                    },
                },
            }),
        },
    },
    MuiBackdrop: {
        styleOverrides: {
            root: {
                backdropFilter: "blur(2px)",
            },
        },
    },

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
    MuiButton: {
        styleOverrides: { root: { textTransform: "none" } },
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
    MuiListItem: {
        styleOverrides: {
            root: ({ theme }) => ({
                paddingLeft: theme.spacing(0),
                paddingRight: theme.spacing(0),
                color: "inherit",
                textDecoration: "none",
                "&:hover": {
                    backgroundColor: (theme.vars || theme).palette.action.hover,
                },
            }),
        },
    },
};
