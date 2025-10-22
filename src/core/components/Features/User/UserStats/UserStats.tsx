import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FC } from "react";

interface UserStatsProps {
    followingCount: number;
    followersCount: number;
}

export const UserStats: FC<UserStatsProps> = ({ followingCount, followersCount }) => (
    <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
        <Typography variant="body2" color="textSecondary">
            Subscribers: {followersCount}
        </Typography>
        <Typography variant="body2" color="textSecondary">
            Subscribed: {followingCount}
        </Typography>
    </Box>
);
