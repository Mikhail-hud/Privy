import Paper from "@mui/material/Paper";
import {
    LOOKUP_PAGE_PATH,
    DIALOGS_PAGE_PATH,
    PROFILE_PAGE_PATH,
    FAVORITES_PAGE_PATH,
} from "@app/core/constants/pathConstants";
import ForumIcon from "@mui/icons-material/Forum";
import PersonIcon from "@mui/icons-material/Person";
import { Link as RouterLink } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BottomNavigation from "@mui/material/BottomNavigation";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import TravelExploreOutlinedIcon from "@mui/icons-material/TravelExploreOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

export const NAV_ITEMS = [
    {
        path: PROFILE_PAGE_PATH,
        icon: <PersonOutlineOutlinedIcon />,
        activeIcon: <PersonIcon />,
        label: "Profile",
    },
    {
        path: LOOKUP_PAGE_PATH,
        icon: <TravelExploreOutlinedIcon />,
        activeIcon: <TravelExploreIcon />,
        label: "Lookup",
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
        <Paper
            sx={theme => ({
                bottom: 0,
                position: "sticky",
                zIndex: theme.zIndex.appBar,
            })}
            elevation={0}
        >
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
