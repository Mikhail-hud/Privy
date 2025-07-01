import { FC } from "react";
import { Typography } from "@mui/material";
import { useGetProfileQuery } from "@app/core/services";

export const Favorites: FC = () => {
    const { data } = useGetProfileQuery();
    return (
        <>
            <Typography component="h1" variant="h4" gutterBottom align="center">
                Favorites Page for {data?.username || "Guest"}
            </Typography>
        </>
    );
};
