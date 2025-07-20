import { FC } from "react";
import { Typography } from "@mui/material";
import { useUser } from "@app/core/hooks";
import { useGetProfileQuery } from "@app/core/services";

export const Profile: FC = () => {
    const { user } = useUser();
    const { data } = useGetProfileQuery();
    return (
        <>
            <Typography component="h1" variant="h4" gutterBottom align="center">
                Profile Page for {data?.username ?? "Guest"}
            </Typography>
            <Typography component="h2" variant="h5" gutterBottom align="center">
                User ROLE: {user?.role ?? "N/A"}
            </Typography>
        </>
    );
};
