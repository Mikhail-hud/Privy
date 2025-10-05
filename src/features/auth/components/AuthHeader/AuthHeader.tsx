import { FC } from "react";
import Typography from "@mui/material/Typography";

interface AuthHeaderProps {
    title: string;
}

export const AuthHeader: FC<AuthHeaderProps> = ({ title }) => (
    <Typography component="h1" variant="h3" color="primary">
        {title}
    </Typography>
);
