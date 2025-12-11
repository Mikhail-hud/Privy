import { FC } from "react";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import { Profile } from "@app/core/services";
import { Reveals } from "@app/core/components";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { AccountMenu } from "@app/core/components/Widgets/TopBar/AccountMenu";

interface TopBarProps {
    signOut: () => void;
    profile: Profile;
    onAccountMenuItemClick: (key: string) => () => void;
}

export const TopBar: FC<TopBarProps> = memo(props => (
    <Paper elevation={0} component="header" sx={{ top: 0, position: "sticky", zIndex: theme => theme.zIndex.appBar }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <AccountMenu {...props} />
            <Box sx={{ flexWrap: "nowrap", display: "flex" }}>
                <Reveals />
                <IconButton size="large" color="inherit">
                    <Badge badgeContent={17} color="primary">
                        <NotificationsIcon color="action" />
                    </Badge>
                </IconButton>
            </Box>
        </Toolbar>
    </Paper>
));
