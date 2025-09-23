import { FC } from "react";
import { useAuth } from "@app/core/hooks";
import { Typography } from "@mui/material";

export const Favorites: FC = () => {
    const { profile } = useAuth();
    return (
        <Typography component="h1" variant="h4" gutterBottom align="center">
            Favorites Page for {profile.userName || "Guest"}
        </Typography>
    );
};
