import { FC } from "react";
import { Typography } from "@mui/material";
import { useGetProfileQuery } from "@app/core/services";

export const Dashboard: FC = () => {
    const { data } = useGetProfileQuery();
    return (
        <>
            <Typography component="h1" variant="h4" gutterBottom align="center">
                Dashboard Page for {`${data?.username} > ${data?.role}`}
            </Typography>
        </>
    );
};
