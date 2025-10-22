import { FC, Ref } from "react";
import Box from "@mui/material/Box";
import CircularProgress, { CircularProgressProps } from "@mui/material/CircularProgress";

interface SpinerProps extends CircularProgressProps {
    ref?: Ref<HTMLDivElement>;
}

export const Spiner: FC<SpinerProps> = ({ ref, ...rest }) => {
    return (
        <Box ref={ref} sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center", p: 1 }}>
            <CircularProgress size="2rem" color="primary" {...rest} />
        </Box>
    );
};
