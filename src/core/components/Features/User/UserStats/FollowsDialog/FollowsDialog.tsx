import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Dialog from "@mui/material/Dialog";
import { UserStatsType } from "@app/core/components";
import { useAuth, useIsMobile } from "@app/core/hooks";
import DialogContent from "@mui/material/DialogContent";
import { FC, useState, SyntheticEvent, Activity } from "react";
import { FollowersList } from "@app/core/components/Features/User/UserStats/FollowersList";
import { FollowingList } from "@app/core/components/Features/User/UserStats/FollowingList";

interface FollowsDialogProps {
    open: boolean;
    onClose: (event: SyntheticEvent) => void;
    userName: string;
    followersCount: number;
    followingCount: number;
    initialTab: UserStatsType | null;
}

export const FollowsDialog: FC<FollowsDialogProps> = ({
    open,
    onClose,
    userName,
    initialTab,
    followersCount,
    followingCount,
}) => {
    const {
        profile: { userName: isOwnerUserName },
    } = useAuth();
    const isMobile: boolean = useIsMobile();

    const [tab, setTab] = useState<UserStatsType | null>(initialTab);

    const handleDialogEntered = (): void => setTab(initialTab);

    const handleChange = (event: SyntheticEvent, newValue: UserStatsType) => {
        event.stopPropagation();
        event.preventDefault();
        setTab(newValue);
    };

    const handleDialogExited = (): void => setTab(null);

    return (
        <Dialog
            fullWidth
            open={open}
            maxWidth="sm"
            onClose={onClose}
            fullScreen={isMobile}
            slotProps={{ transition: { onEntered: handleDialogEntered, onExited: handleDialogExited } }}
        >
            {tab && (
                <>
                    <Tabs value={tab} onChange={handleChange} variant="fullWidth">
                        <Tab label={`Subscribers: ${followersCount}`} value="followers" />
                        <Tab label={`Subscribed: ${followingCount}`} value="following" />
                    </Tabs>
                    <DialogContent>
                        <Activity mode={tab === "followers" ? "visible" : "hidden"}>
                            <FollowersList userName={userName} type="followers" isOwnerUserName={isOwnerUserName} />
                        </Activity>
                        <Activity mode={tab === "following" ? "visible" : "hidden"}>
                            <FollowingList type="following" userName={userName} isOwnerUserName={isOwnerUserName} />
                        </Activity>
                    </DialogContent>
                </>
            )}
        </Dialog>
    );
};
