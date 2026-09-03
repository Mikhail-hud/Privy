import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useMemo } from "react";
import { useIsMobile } from "@app/core/hooks";
import GestureIcon from "@mui/icons-material/Gesture";
import { Link, useMatches, useParams } from "react-router-dom";
import MonochromePhotosIcon from "@mui/icons-material/MonochromePhotos";
import {
    USER_PROFILE_PAGE_PATH,
    USER_PROFILE_PHOTOS_TAB_PATH,
    userProfilePath,
    userProfilePhotosPath,
} from "@app/core/constants/pathConstants";

interface TabHandle {
    tab: string;
}

export const UserProfileTabs = () => {
    const matches = useMatches();
    const isMobile: boolean = useIsMobile();
    const { userName } = useParams();

    const activeTabMatch = matches.find(match => (match.handle as TabHandle)?.tab);
    const activeTab: string = (activeTabMatch?.handle as TabHandle)?.tab;

    const tabs = useMemo(
        () => [
            {
                value: USER_PROFILE_PAGE_PATH,
                label: "Threads",
                icon: <GestureIcon />,
                to: userProfilePath(userName ?? ""),
            },
            {
                value: USER_PROFILE_PHOTOS_TAB_PATH,
                label: "Photos",
                icon: <MonochromePhotosIcon />,
                to: userProfilePhotosPath(userName ?? ""),
            },
        ],
        [userName]
    );

    return (
        <Tabs variant={isMobile ? "scrollable" : "fullWidth"} scrollButtons allowScrollButtonsMobile value={activeTab}>
            {tabs.map(tab => (
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
