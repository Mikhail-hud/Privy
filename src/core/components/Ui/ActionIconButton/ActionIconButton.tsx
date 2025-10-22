import { FC, ReactNode } from "react";
import { alpha } from "@mui/material/styles";
import { SxProps, Theme } from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";

interface ActionIconButtonProps extends IconButtonProps {
    icon: ReactNode;
    label?: string;
}

export const ActionIconButton: FC<ActionIconButtonProps> = ({ icon, label, sx = {}, ...rest }) => {
    return (
        <IconButton
            {...rest}
            sx={
                [
                    (theme: Theme) => ({
                        flexDirection: "column",
                        color: (theme.vars || theme).palette.common.white,
                        backgroundColor: "transparent",
                        "&:hover": {
                            backgroundColor: "transparent",
                        },
                        "&.Mui-disabled": {
                            color: alpha(theme.palette.common.white, 0.3),
                        },
                        ".MuiIconButton-loadingIndicator": {
                            color: (theme.vars || theme).palette.common.white,
                        },
                    }),
                    sx,
                ].filter(Boolean) as SxProps<Theme>
            }
        >
            {icon}
            {label && <Typography variant="caption">{label}</Typography>}
        </IconButton>
    );
};
