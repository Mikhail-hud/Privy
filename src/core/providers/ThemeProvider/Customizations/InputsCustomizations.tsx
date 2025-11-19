import { Theme, Components } from "@mui/material/styles";

const minHeightHeight44 = {
    minHeight: 44,
    height: 44,
};

const minHeightHeight52 = {
    minHeight: 52,
    height: 52,
};

export const inputsCustomizations: Components<Theme> = {
    MuiCssBaseline: {
        styleOverrides: (theme: Theme) => ({
            "@keyframes slideUp": {
                from: { transform: "translateY(100%)" },
                to: { transform: "translateY(0)" },
            },
            "@keyframes gradientShimmer": {
                "0%": {
                    backgroundPosition: "0% 50%",
                },
                "50%": {
                    backgroundPosition: "100% 50%",
                },
                "100%": {
                    backgroundPosition: "0% 50%",
                },
            },
            html: {
                [theme.breakpoints.down("sm")]: {
                    fontSize: "0.875rem",
                },
                [theme.breakpoints.between("sm", "md")]: {
                    fontSize: "0.9375rem",
                },
            },
        }),
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
            root: ({ theme }) => ({
                [theme.breakpoints.down("sm")]: {
                    ...minHeightHeight44,
                },
            }),
        },
    },
    MuiTab: {
        styleOverrides: {
            root: ({ theme }) => ({
                textTransform: "none",
                "& .MuiSvgIcon-root": {
                    marginBottom: 0,
                },
                [theme.breakpoints.down("sm")]: {
                    ...minHeightHeight44,
                    padding: theme.spacing(0.5),
                    "& .MuiSvgIcon-root": {
                        fontSize: "1.1rem",
                    },
                },
                [theme.breakpoints.up("sm")]: {
                    ...minHeightHeight52,
                },
            }),
        },
    },

    MuiToolbar: {
        // TopBar widget src/core/components/Widgets/TopBar/TopBar.tsx
        styleOverrides: {
            root: ({ theme }) => ({
                [theme.breakpoints.down("sm")]: {
                    ...minHeightHeight44,
                    padding: theme.spacing(0, 1),
                },
                [theme.breakpoints.up("sm")]: {
                    ...minHeightHeight52,
                },
            }),
        },
    },

    MuiBottomNavigation: {
        styleOverrides: {
            root: ({ theme }) => ({
                [theme.breakpoints.down("sm")]: {
                    ...minHeightHeight44,
                },
                [theme.breakpoints.up("sm")]: {
                    ...minHeightHeight52,
                },
            }),
        },
    },

    MuiBottomNavigationAction: {
        styleOverrides: {
            root: ({ theme }) => ({
                minWidth: "auto",
                [theme.breakpoints.down("sm")]: {
                    padding: 0,
                    "& .MuiSvgIcon-root": {
                        fontSize: "1.1rem",
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
    MuiCard: {
        styleOverrides: {
            root: ({ theme }) => ({
                [theme.breakpoints.down("sm")]: {
                    padding: theme.spacing(1),
                },
            }),
        },
    },

    MuiCardContent: {
        styleOverrides: {
            root: ({ theme }) => ({
                [theme.breakpoints.down("sm")]: {
                    padding: theme.spacing(1),
                    "&:last-child": {
                        paddingBottom: theme.spacing(1),
                    },
                },
            }),
        },
    },

    MuiCardActions: {
        styleOverrides: {
            root: ({ theme }) => ({
                [theme.breakpoints.down("sm")]: {
                    padding: theme.spacing(1),
                },
            }),
        },
    },
};
