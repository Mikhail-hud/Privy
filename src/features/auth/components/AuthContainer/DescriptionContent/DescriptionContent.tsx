import { FC } from "react";
import Stack from "@mui/material/Stack";
import LockIcon from "@mui/icons-material/Lock";
import ForumIcon from "@mui/icons-material/Forum";
import Typography from "@mui/material/Typography";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

export const DescriptionContent: FC = () => {
    return (
        <Stack spacing={2} sx={{ textAlign: "start", width: "100%" }}>
            <Typography variant="subtitle1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LockIcon color="primary" /> Privacy & Control
            </Typography>
            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
            >
                <VisibilityOffIcon sx={{ mt: 0.5, flexShrink: 0 }} fontSize="small" color="action" />
                Incognito Profile Mode: Allows users to completely hide personal details (full name, photo,
                description), remaining visible on the network only under their @username.
            </Typography>
            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
            >
                <PersonSearchIcon sx={{ mt: 0.5, flexShrink: 0 }} fontSize="small" color="action" />
                Incognito Photo: Users can upload a separate photo to be displayed when their main profile is hidden.
            </Typography>
            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
            >
                <LockIcon sx={{ mt: 0.5, flexShrink: 0 }} fontSize="small" color="action" />
                Selective Profile Reveal: Send requests and grant access to your full profile only to select users,
                creating a circle of trust.
            </Typography>
            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
            >
                <ForumIcon sx={{ mt: 0.5, flexShrink: 0 }} fontSize="small" color="action" />
                Anonymous Posts & Comments: Publish content (threads and replies) in incognito mode, allowing you to
                express your opinion freely.
            </Typography>
        </Stack>
    );
};
