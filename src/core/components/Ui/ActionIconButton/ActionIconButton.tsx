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
                        borderRadius: "10px",
                        padding: theme.spacing(0.8),
                        backgroundColor: alpha(theme.palette.common.black, 0.3),
                        "&:hover": {
                            backgroundColor: alpha(theme.palette.common.black, 0.5),
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
