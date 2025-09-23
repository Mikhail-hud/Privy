import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { AccountMenu } from "@app/core/components/TopBar/AccountMenu";

export const TopBar = () => (
    <Paper elevation={0} component="header" sx={{ top: 0, position: "sticky", zIndex: theme => theme.zIndex.appBar }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <AccountMenu />
            <Box>
                <IconButton size="large" color="inherit">
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
            </Box>
        </Toolbar>
    </Paper>
);
