import { FC } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { ContentCardContainer } from "@app/core/components";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";

interface ThreadDetailsErrorFallbackProps {
    onRetry: () => void;
    onBack: () => void;
}

export const ThreadDetailsErrorFallback: FC<ThreadDetailsErrorFallbackProps> = ({ onRetry, onBack }) => {
    return (
        <ContentCardContainer
            sx={theme => ({
                padding: theme.spacing(3),
                [theme.breakpoints.down("sm")]: {
                    padding: theme.spacing(1.5, 2),
                },
            })}
        >
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}>
                <IconButton size="small" onClick={onBack} aria-label="Back to Talk Space">
                    <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Typography variant="h3" color="primary">
                    Thread
                </Typography>
            </Box>
            <Divider />
            <Box
                sx={{
                    mt: 1,
                    py: 4,
                    display: "flex",
                    gap: 0.5,
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                <ErrorOutlineIcon sx={{ fontSize: { xxs: 35, xs: 40, sm: 50 } }} color="error" />
                <Typography color="error" variant="subtitle1">
                    Failed to Load Thread
                </Typography>
                <Typography variant="body1" color="textSecondary" textAlign="center">
                    Something went wrong while loading this thread.
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <Button variant="outlined" onClick={onBack}>
                        Back to Talk Space
                    </Button>
                    <Button variant="contained" onClick={onRetry}>
                        Try Again
                    </Button>
                </Box>
            </Box>
        </ContentCardContainer>
    );
};
