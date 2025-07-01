import { FC } from "react";
import { Typography } from "@mui/material";
import { useUser } from "@app/core/hooks";
import { useGetProfileQuery } from "@app/core/services";

export const Profile: FC = () => {
    const { user } = useUser();
    console.log("User in Profile:", user);
    const { data } = useGetProfileQuery();
    return (
        <>
            <Typography component="h1" variant="h4" gutterBottom align="center">
                Profile Page for {data?.username || "Guest"}
            </Typography>
        </>
    );
};
