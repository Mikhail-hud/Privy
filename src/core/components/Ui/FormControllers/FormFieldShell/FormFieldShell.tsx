import Box from "@mui/material/Box";
import { styled } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import { PropsWithChildren, ReactNode } from "react";

const InputBox = styled(Box)(({ theme }) => ({
    borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    flexWrap: "wrap",
    minHeight: 32,
    gap: theme.spacing(0.5),
    "&:hover": {
        borderColor: (theme.vars || theme).palette.primary.main,
    },
}));

interface FormFieldShellProps<T> {
    data: T[];
    label: string;
    onClick: () => void;
    placeholder: string;
    render: (item: T, index: number) => ReactNode;
}

export const FormFieldShell = <T,>({
    label,
    onClick,
    render,
    data,
    children,
    placeholder,
}: PropsWithChildren<FormFieldShellProps<T>>) => {
    return (
        <FormControl variant="standard" fullWidth>
            <InputLabel shrink sx={{ position: "relative" }}>
                {label}
            </InputLabel>
            <InputBox onClick={onClick}>
                {data && data.length > 0 ? (
                    data.map((item, index) => render(item, index))
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        {placeholder}
                    </Typography>
                )}
            </InputBox>
            {children}
        </FormControl>
    );
};
