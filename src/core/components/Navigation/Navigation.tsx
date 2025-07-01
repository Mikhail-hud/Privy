import { FC } from "react";
import {
    DIALOGS_PAGE_PATH,
    FAVORITES_PAGE_PATH,
    PROFILE_PAGE_PATH,
    SETTINGS_PAGE_PATH,
} from "@app/core/constants/pathConstants";
import ForumIcon from "@mui/icons-material/Forum";
import PersonIcon from "@mui/icons-material/Person";
import { AccountMenu } from "@app/core/components";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, IconButton, useTheme } from "@mui/material";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import { Link as RouterLink, useLocation } from "react-router-dom";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

const navItems = [
    { path: PROFILE_PAGE_PATH, icon: <PersonOutlineOutlinedIcon />, activeIcon: <PersonIcon /> },
    { path: DIALOGS_PAGE_PATH, icon: <ForumOutlinedIcon />, activeIcon: <ForumIcon /> },
    { path: FAVORITES_PAGE_PATH, icon: <FavoriteBorderOutlinedIcon />, activeIcon: <FavoriteIcon /> },
];

export const Navigation: FC = () => {
    const theme = useTheme();
    const location = useLocation();

    return (
        <Box
            component="aside"
            sx={{
                left: 0,
                top: 0,
                height: "100%",
                position: "fixed",
                width: `calc(${theme.spacing(7)} + 1px)`,
                zIndex: theme.zIndex.drawer + 1,
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
                alignItems: "center",
                py: 2,
            }}
        >
            <AccountMenu />
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {navItems.map(item => (
                    <IconButton sx={{ mb: 1 }} key={item.path} component={RouterLink} to={item.path}>
                        {location.pathname === item.path ? item.activeIcon : item.icon}
                    </IconButton>
                ))}
            </Box>
            <IconButton component={RouterLink} to={SETTINGS_PAGE_PATH}>
                {location.pathname === SETTINGS_PAGE_PATH ? <SettingsIcon /> : <SettingsOutlinedIcon />}
            </IconButton>
        </Box>
    );
};
