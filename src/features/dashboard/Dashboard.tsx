import { FC } from "react";
import { useAuth } from "@app/core/hooks";
import { Typography } from "@mui/material";

export const Dashboard: FC = () => {
    const { profile } = useAuth();
    return (
        <Typography component="h1" variant="h4" gutterBottom align="center">
            Dashboard Page for {`${profile.userName} > ${profile.role}`}
        </Typography>
    );
};
