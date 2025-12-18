import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Badge from "@mui/material/Badge";
import Dialog from "@mui/material/Dialog";
import { useIsMobile } from "@app/core/hooks";
import IconButton from "@mui/material/IconButton";
import DialogContent from "@mui/material/DialogContent";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Activity, FC, SyntheticEvent, useState } from "react";
import { POLLING_INTERVAL } from "@app/core/constants/general.ts";
import { IncomingRequests, OutgoingRequests } from "@app/core/components";
import { useGetPeendingRevealRequestsCountQuery } from "@app/core/services";

export type RevealsStatsType = "incomingRequests" | "outgoingRequests";

export const RevealsRequests: FC = memo(() => {
    const isMobile: boolean = useIsMobile();
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState<RevealsStatsType>("incomingRequests");

    const { data } = useGetPeendingRevealRequestsCountQuery({ refetchInterval: POLLING_INTERVAL });

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
                        <Tab label="Incoming Requests" value="incomingRequests" />
                        <Tab label="Outgoing Requests" value="outgoingRequests" />
                    </Tabs>
                    <DialogContent>
                        <Activity mode={tab === "incomingRequests" ? "visible" : "hidden"}>
                            <IncomingRequests type={tab} />
                        </Activity>
                        <Activity mode={tab === "outgoingRequests" ? "visible" : "hidden"}>
                            <OutgoingRequests type={tab} />
                        </Activity>
                    </DialogContent>
                </>
            </Dialog>
        </>
    );
});
