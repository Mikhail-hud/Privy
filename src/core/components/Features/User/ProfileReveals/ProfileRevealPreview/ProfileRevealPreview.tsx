import {
    ProfileRevealToMe,
    ProfileRevealToMeListResponse,
    useGetRevealedToMeProfilesInfiniteQuery,
} from "@app/core/services";
import { FC, useMemo } from "react";
import { Avatar } from "@app/core/components";
import Skeleton from "@mui/material/Skeleton";
import { useIsMobile } from "@app/core/hooks";
import IconButton from "@mui/material/IconButton";
import AvatarGroup from "@mui/material/AvatarGroup";
import Diversity2Icon from "@mui/icons-material/Diversity2";

interface ProfileRevealPreviewProps {
    handleOpen: () => void;
}
export const ProfileRevealPreview: FC<ProfileRevealPreviewProps> = ({ handleOpen }) => {
    const isMobile: boolean = useIsMobile();
    const { data, isLoading } = useGetRevealedToMeProfilesInfiniteQuery({ page: 1, limit: 3 });

    const profileReveals = useMemo<{ profiles: ProfileRevealToMe[]; total: number }>(() => {
        if (!data) return { profiles: [], total: 0 };
        const profiles: ProfileRevealToMe[] = data.pages.flatMap((page: ProfileRevealToMeListResponse) => page.data);
        const firstPageWithTotal = data.pages.find((page: ProfileRevealToMeListResponse) => page.total);
        const total: number = firstPageWithTotal?.total ?? 0;
        return { profiles, total };
    }, [data]);

    if (isLoading) {
        return <Skeleton variant="circular" width={34} height={34} />;
    }

    return (
        <>
            <AvatarGroup
                max={4}
                spacing={6}
                total={profileReveals?.total}
                onClick={handleOpen}
                sx={{
                    cursor: "pointer",
                    "& .MuiAvatar-root": {
                        width: isMobile ? 26 : 30,
                        height: isMobile ? 26 : 30,
                        fontSize: isMobile ? "small" : "medium",
                    },
                }}
            >
                {!isLoading && profileReveals.profiles.length === 0 ? (
                    <IconButton sx={{ height: 34, width: 34 }} size="large" color="inherit" onClick={handleOpen}>
                        <Diversity2Icon color="primary" />
                    </IconButton>
                ) : (
                    (profileReveals.profiles || []).map(({ revealer }: ProfileRevealToMe) => (
                        <Avatar
                            key={revealer.id}
                            userName={revealer?.userName}
                            alt={revealer?.publicPhoto?.src}
                            src={revealer?.publicPhoto?.src}
                        />
                    ))
                )}
            </AvatarGroup>
        </>
    );
};
