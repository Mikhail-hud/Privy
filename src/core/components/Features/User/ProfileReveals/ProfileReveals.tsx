import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Dialog from "@mui/material/Dialog";
import { useIsMobile } from "@app/core/hooks";
import DialogContent from "@mui/material/DialogContent";
import { Activity, FC, SyntheticEvent, useState } from "react";
import { ProfileRevealPreview, RevealedByMeRequests, RevealedToMeRequests } from "@app/core/components";

export type ProfileRevealsStatsType = "revealedByMe" | "revealedToMe";

export const ProfileReveals: FC = memo(() => {
    const isMobile: boolean = useIsMobile();
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState<ProfileRevealsStatsType>("revealedToMe");

    const handleChange = (event: SyntheticEvent, newValue: ProfileRevealsStatsType): void => {
        event.stopPropagation();
        event.preventDefault();
        setTab(newValue);
    };

    const handleOpen = (): void => setOpen(true);

    const handleClose = (event: SyntheticEvent): void => {
        event.stopPropagation();
        event.preventDefault();
        setOpen(false);
    };

    return (
        <>
            <ProfileRevealPreview handleOpen={handleOpen} />
            <Dialog fullWidth open={open} maxWidth="sm" onClose={handleClose} fullScreen={isMobile}>
                <>
                    <Tabs value={tab} onChange={handleChange} variant="fullWidth">
                        <Tab label="Profiles Shared With Me" value="revealedToMe" />
                        <Tab label="Profiles I Shared" value="revealedByMe" />
                    </Tabs>
                    <DialogContent>
                        <Activity mode={tab === "revealedToMe" ? "visible" : "hidden"}>
                            <RevealedToMeRequests type={tab} />
                        </Activity>
                        <Activity mode={tab === "revealedByMe" ? "visible" : "hidden"}>
                            <RevealedByMeRequests type={tab} />
                        </Activity>
                    </DialogContent>
                </>
            </Dialog>
        </>
    );
});
