import { FC, MouseEvent } from "react";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import ListItemIcon from "@mui/material/ListItemIcon";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useGetProfileQuery, UserRole } from "@app/core/services";
import { NavigateFunction, useNavigate, useSubmit } from "react-router-dom";
import { Avatar, Box, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { DASHBOARD_PAGE_PATH, SETTINGS_PAGE_PATH, SIGN_OUT_ACTION_ONLY_PATH } from "@app/core/constants/pathConstants";

export const AccountMenu: FC = () => {
    const submit = useSubmit();
    const { data } = useGetProfileQuery();
    const navigate: NavigateFunction = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open: boolean = Boolean(anchorEl);

    const handleClick = (event: MouseEvent<HTMLElement>): void => setAnchorEl(event.currentTarget);

    const handleClose = (): void => setAnchorEl(null);

    const handleMenuItemClick = (key: string): void => navigate(key);

    const handleSignOut = (): void => {
        submit(null, { method: "post", action: SIGN_OUT_ACTION_ONLY_PATH });
    };
    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
                <IconButton
                    size="small"
                    onClick={handleClick}
                    aria-haspopup="true"
                    aria-controls={open ? "account-menu" : undefined}
                    aria-expanded={open ? "true" : undefined}
                >
                    <Avatar src={data?.profilePhoto?.url} sx={{ width: 32, height: 32 }}>
                        {data?.username?.charAt(0).toUpperCase() || "U"}
                    </Avatar>
                </IconButton>
            </Box>
            <Menu open={open} id="account-menu" anchorEl={anchorEl} onClose={handleClose} onClick={handleClose}>
                <MenuItem onClick={() => handleMenuItemClick(SETTINGS_PAGE_PATH)}>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                {data?.role === UserRole.ADMIN && (
                    <MenuItem onClick={() => handleMenuItemClick(DASHBOARD_PAGE_PATH)}>
                        <ListItemIcon>
                            <DashboardIcon fontSize="small" />
                        </ListItemIcon>
                        Dashboard
                    </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={handleSignOut}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Sign Out
                </MenuItem>
            </Menu>
        </>
    );
};
