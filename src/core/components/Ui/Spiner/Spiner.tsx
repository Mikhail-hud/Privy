import { FC } from "react";
import Box from "@mui/material/Box";
import CircularProgress, { CircularProgressProps } from "@mui/material/CircularProgress";

export const Spiner: FC<CircularProgressProps> = props => {
    return (
        <Box sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress size="3rem" color="primary" {...props} />
        </Box>
    );
};
