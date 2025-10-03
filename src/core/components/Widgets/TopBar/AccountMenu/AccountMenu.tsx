import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import { FC, MouseEvent } from "react";
import { useAuth } from "@app/core/hooks";
import Divider from "@mui/material/Divider";
import { UserRole } from "@app/core/services";
import { Avatar } from "@app/core/components";
import Logout from "@mui/icons-material/Logout";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Settings from "@mui/icons-material/Settings";
import ListItemIcon from "@mui/material/ListItemIcon";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { DASHBOARD_PAGE_PATH, SETTINGS_PAGE_PATH } from "@app/core/constants/pathConstants";

export const AccountMenu: FC = () => {
    const { profile, signOut } = useAuth();

    const navigate: NavigateFunction = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open: boolean = Boolean(anchorEl);

    const handleClick = (event: MouseEvent<HTMLElement>): void => setAnchorEl(event.currentTarget);

    const handleClose = (): void => setAnchorEl(null);

    const handleMenuItemClick = (key: string): void => navigate(key);

    const handleSignOut = (): void => signOut();

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
                    <Avatar
                        profile={profile}
                        alt="public_photo"
                        src={profile.publicPhoto?.signedUrl}
                        sx={{ width: 32, height: 32 }}
                        skeleton={{ width: 32, height: 32 }}
                    />
                </IconButton>
            </Box>
            <Menu open={open} id="account-menu" anchorEl={anchorEl} onClose={handleClose} onClick={handleClose}>
                <MenuItem onClick={() => handleMenuItemClick(SETTINGS_PAGE_PATH)}>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                {profile.role === UserRole.ADMIN && (
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
