import { FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import GestureIcon from "@mui/icons-material/Gesture";

interface EmptyThreadFallbackProps {
    isOwner: boolean;
    onCreateThread?: () => void;
}

export const EmptyThreadFallback: FC<EmptyThreadFallbackProps> = ({ isOwner, onCreateThread }) => {
    return (
        <Box
            onClick={isOwner ? onCreateThread : undefined}
            sx={{
                mt: 1,
                display: "flex",
                gap: 0.5,
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                cursor: isOwner ? "pointer" : "default",
            }}
        >
            <GestureIcon sx={{ fontSize: { xxs: 35, xs: 40, sm: 50 } }} color="primary" />
            <Typography color="primary" variant="subtitle1">
                No Thread Yet
            </Typography>
            {isOwner && (
                <Typography variant="body1" color="textPrimary">
                    Tap here to post your first Thread
                </Typography>
            )}
        </Box>
    );
};
