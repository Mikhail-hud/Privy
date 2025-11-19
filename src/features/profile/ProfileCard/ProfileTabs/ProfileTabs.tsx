import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import {
    PROFILE_PAGE_PATH,
    PROFILE_PHOTOS_TAB_PATH,
    PROFILE_REPLIES_TAB_PATH,
    PROFILE_FAVORITES_TAB_PATH,
} from "@app/core/constants/pathConstants";
import { useIsMobile } from "@app/core/hooks";
import { Link, useMatches } from "react-router-dom";
import GestureIcon from "@mui/icons-material/Gesture";
import FavoriteIcon from "@mui/icons-material/Favorite";
import QuickreplyIcon from "@mui/icons-material/Quickreply";
import MonochromePhotosIcon from "@mui/icons-material/MonochromePhotos";

interface TabHandle {
    tab: string;
}

const TABS_CONFIG = [
    { value: PROFILE_PAGE_PATH, label: "Threads", icon: <GestureIcon />, to: PROFILE_PAGE_PATH },
    { value: PROFILE_FAVORITES_TAB_PATH, label: "Favorites", icon: <FavoriteIcon />, to: PROFILE_FAVORITES_TAB_PATH },
    { value: PROFILE_REPLIES_TAB_PATH, label: "Replies", icon: <QuickreplyIcon />, to: PROFILE_REPLIES_TAB_PATH },
    {
        value: PROFILE_PHOTOS_TAB_PATH,
        label: "Photos",
        icon: <MonochromePhotosIcon />,
        to: PROFILE_PHOTOS_TAB_PATH,
    },
] as const;

export const ProfileTabs = () => {
    const matches = useMatches();
    const isMobile: boolean = useIsMobile();
    const activeTabMatch = matches.find(match => (match.handle as TabHandle)?.tab);

    const activeTab: string = (activeTabMatch?.handle as TabHandle)?.tab;

    return (
        <Tabs variant={isMobile ? "scrollable" : "fullWidth"} scrollButtons allowScrollButtonsMobile value={activeTab}>
            {TABS_CONFIG.map(tab => (
                <Tab
                    to={tab.to}
                    component={Link}
                    key={tab.value}
                    icon={tab.icon}
                    label={tab.label}
                    value={tab.value}
                    sx={{ textTransform: "none" }}
                />
            ))}
        </Tabs>
    );
};
