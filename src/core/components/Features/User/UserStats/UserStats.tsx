import Box from "@mui/material/Box";
import { Link } from "@mui/material";
import { FC, MouseEvent, SyntheticEvent, useState } from "react";
import { FollowsDialog } from "@app/core/components/Features/User/UserStats/FollowsDialog";

interface UserStatsProps {
    followingCount: number;
    followersCount: number;
    userName: string;
}

export type UserStatsType = "followers" | "following";

export const UserStats: FC<UserStatsProps> = memo(({ followingCount, followersCount, userName }) => {
    const [open, setOpen] = useState(false);
    const [initialTab, setInitialTab] = useState<UserStatsType | null>(null);

    const handleOpen =
        (tab: UserStatsType) =>
        (event: MouseEvent<HTMLButtonElement>): void => {
            event.stopPropagation();
            event.preventDefault();
            setInitialTab(tab);
            setOpen(true);
        };

    const handleClose = (event: SyntheticEvent): void => {
        event.stopPropagation();
        event.preventDefault();
        setOpen(false);
    };
    const onListItemClick = (_event: MouseEvent<HTMLAnchorElement>): void => setOpen(false);

    return (
        <>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Link
                    variant="body2"
                    component="button"
                    underline="hover"
                    color="textSecondary"
                    onClick={handleOpen("followers")}
                >
                    Subscribers: {followersCount}
                </Link>
                <Link
                    variant="body2"
                    component="button"
                    underline="hover"
                    color="textSecondary"
                    onClick={handleOpen("following")}
                >
                    Subscribed: {followingCount}
                </Link>
            </Box>
            <FollowsDialog
                open={open}
                onClose={handleClose}
                userName={userName}
                initialTab={initialTab}
                followersCount={followersCount}
                followingCount={followingCount}
                onListItemClick={onListItemClick}
            />
        </>
    );
});
