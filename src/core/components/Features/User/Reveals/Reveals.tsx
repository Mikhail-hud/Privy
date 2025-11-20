import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Badge from "@mui/material/Badge";
import Dialog from "@mui/material/Dialog";
import { useIsMobile } from "@app/core/hooks";
import IconButton from "@mui/material/IconButton";
import DialogContent from "@mui/material/DialogContent";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Activity, FC, SyntheticEvent, useState } from "react";
import { useGetPeendingRevealRequestsCountQuery } from "@app/core/services";
import { POLLING_INTERVAL, SKIP_TOKEN } from "@app/core/constants/general.ts";
import { RevealRequests } from "@app/core/components/Features/User/Reveals/RevealRequests";
import { RevealedProfiles } from "@app/core/components/Features/User/Reveals/RevealedProfiles";

export type RevealsStatsType = "revealedProfiles" | "revealRequests";

export const Reveals: FC = memo(() => {
    const isMobile: boolean = useIsMobile();
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState<RevealsStatsType>("revealRequests");

    const { data } = useGetPeendingRevealRequestsCountQuery(SKIP_TOKEN, { pollingInterval: POLLING_INTERVAL });

    const handleChange = (event: SyntheticEvent, newValue: RevealsStatsType): void => {
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
            <IconButton size="large" color="inherit" onClick={handleOpen}>
                <Badge badgeContent={data?.count} color="primary">
                    <VisibilityIcon color="action" />
                </Badge>
            </IconButton>
            <Dialog fullWidth open={open} maxWidth="sm" onClose={handleClose} fullScreen={isMobile}>
                <>
                    <Tabs value={tab} onChange={handleChange} variant="fullWidth">
                        <Tab label="Reveal Requests" value="revealRequests" />
                        <Tab label="Profiles Revealed by Me" value="revealedProfiles" />
                    </Tabs>
                    <DialogContent>
                        <Activity mode={tab === "revealRequests" ? "visible" : "hidden"}>
                            <RevealRequests type={tab} />
                        </Activity>
                        <Activity mode={tab === "revealedProfiles" ? "visible" : "hidden"}>
                            <RevealedProfiles type={tab} />
                        </Activity>
                    </DialogContent>
                </>
            </Dialog>
        </>
    );
});
