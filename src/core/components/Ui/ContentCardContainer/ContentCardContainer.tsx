import { FC } from "react";
import { SxProps, Theme } from "@mui/material";
import Card, { CardProps } from "@mui/material/Card";

export const ContentCardContainer: FC<CardProps> = ({ children, sx, ...rest }) => (
    <Card
        {...rest}
        variant="outlined"
        sx={
            [
                {
                    maxWidth: 800,
                    margin: "auto",
                    height: "auto",
                    minHeight: "100%",
                },
                sx,
            ].filter(Boolean) as SxProps<Theme>
        }
    >
        {children}
    </Card>
);
