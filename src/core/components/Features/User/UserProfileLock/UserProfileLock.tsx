import { FC } from "react";
import Box from "@mui/material/Box";
import { RevealStatus } from "@app/core/services";
import Typography from "@mui/material/Typography";
import { PrivateIcon } from "@app/core/assets/icons";
import { UserRevealButton } from "@app/core/components/Features/User/UserRevealButton";

interface UserProfileLockProps {
    userName: string;
    status: RevealStatus | undefined;
}

export const UserProfileLock: FC<UserProfileLockProps> = ({ userName, status }) => {
    return (
        <Box sx={{ textAlign: "center" }}>
            <Box
                sx={{
                    gap: 1,
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                    justifyContent: "center",
                }}
            >
                <PrivateIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography
                    variant="subtitle1"
                    color="primary"
                    sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                    }}
                >
                    This profile is hidden (Incognito Mode)
                </Typography>
            </Box>
            <Typography variant="body1" color="textPrimary" sx={{ mb: 1 }}>
                Send a reveal request to unlock the full profile, including bio, links, interests, photos, and more.
            </Typography>
            <UserRevealButton userName={userName} status={status} />
        </Box>
    );
};
