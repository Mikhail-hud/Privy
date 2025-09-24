import Paper from "@mui/material/Paper";
import ForumIcon from "@mui/icons-material/Forum";
import PersonIcon from "@mui/icons-material/Person";
import { Link as RouterLink } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BottomNavigation from "@mui/material/BottomNavigation";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { DIALOGS_PAGE_PATH, FAVORITES_PAGE_PATH, PROFILE_PAGE_PATH } from "@app/core/constants/pathConstants";

export const NAV_ITEMS = [
    {
        path: PROFILE_PAGE_PATH,
        icon: <PersonOutlineOutlinedIcon />,
        activeIcon: <PersonIcon />,
        label: "Profile",
    },
    {
        path: DIALOGS_PAGE_PATH,
        icon: <ForumOutlinedIcon />,
        activeIcon: <ForumIcon />,
        label: "Dialogs",
    },
    {
        path: FAVORITES_PAGE_PATH,
        icon: <FavoriteBorderOutlinedIcon />,
        activeIcon: <FavoriteIcon />,
        label: "Favorites",
    },
];

export const LabelBottomNavigation = () => {
    const location = useLocation();
    const activePath = NAV_ITEMS.find(item => location.pathname.startsWith(item.path))?.path;
    return (
        <Paper sx={{ position: "sticky", bottom: 0 }} elevation={0}>
            <BottomNavigation showLabels value={activePath}>
                {NAV_ITEMS.map(item => (
                    <BottomNavigationAction
                        to={item.path}
                        key={item.path}
                        label={item.label}
                        value={item.path}
                        component={RouterLink}
                        icon={location.pathname.startsWith(item.path) ? item.activeIcon : item.icon}
                    />
                ))}
            </BottomNavigation>
        </Paper>
    );
};
