import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import {
    LOOKUP_PAGE_PATH,
    DIALOGS_PAGE_PATH,
    PROFILE_PAGE_PATH,
    TALK_SPACE_PAGE_PATH,
} from "@app/core/constants/pathConstants";
import { Theme } from "@mui/material/styles";
import { useTheme } from "@app/core/providers";
import { useMediaQuery } from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";
import PersonIcon from "@mui/icons-material/Person";
import { Link as RouterLink } from "react-router-dom";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { ThreadDialogForm } from "@app/core/components";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import BottomNavigation from "@mui/material/BottomNavigation";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import Diversity3Outlined from "@mui/icons-material/Diversity3Outlined";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import TravelExploreOutlinedIcon from "@mui/icons-material/TravelExploreOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

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
        path: TALK_SPACE_PAGE_PATH,
        icon: <Diversity3Outlined />,
        activeIcon: <Diversity3Icon />,
        label: "Talk Space",
    },
];

export const LabelBottomNavigation = () => {
    const theme: Theme = useTheme();
    const isLegacyMobile: boolean = useMediaQuery(theme.breakpoints.down("xs"));
    const isMobile: boolean = useMediaQuery(theme.breakpoints.between("xs", "sm"));
    const location = useLocation();
    const [open, setOpen] = useState<boolean>(false);
    const handleOpen = (): void => setOpen(true);
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
                {NAV_ITEMS.slice(0, 2).map(item => (
                    <BottomNavigationAction
                        to={item.path}
                        key={item.path}
                        label={item.label}
                        value={item.path}
                        component={RouterLink}
                        icon={location.pathname.startsWith(item.path) ? item.activeIcon : item.icon}
                    />
                ))}
                <BottomNavigationAction
                    sx={theme => ({
                        m: 0.3,
                        borderRadius: 2,
                        color: "primary.main",
                        border: "1px solid",
                        borderColor: "primary.light",
                        backgroundColor: theme.palette.action.hover,
                        "&:hover": {
                            backgroundColor: theme.palette.action.selected,
                        },
                    })}
                    label="Create"
                    icon={<PostAddIcon />}
                    onClick={handleOpen}
                />
                {NAV_ITEMS.slice(2).map(item => (
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
            <Box
                sx={{
                    right: 16,
                    position: "fixed",
                    bottom: { xs: 70, sm: 80 },
                    display: isLegacyMobile ? "none" : "block",
                    zIndex: (theme: Theme): number => theme.zIndex.speedDial,
                }}
            >
                <Fab size={isMobile ? "medium" : "large"} onClick={handleOpen} color="primary">
                    <ThreadDialogForm open={open} setOpen={setOpen} action={<PostAddIcon />} />
                </Fab>
            </Box>
        </Paper>
    );
};
