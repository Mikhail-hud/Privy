import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material/styles";
import Popper from "@mui/material/Popper";
import Divider from "@mui/material/Divider";
import { useIsMobile } from "@app/core/hooks";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { NavigateFunction } from "react-router-dom";
import { FC, useState, MouseEvent, ReactNode } from "react";
import { stopEventPropagation } from "@app/core/utils/general.ts";
import { USER_HANDLE_PREFIX } from "@app/core/constants/pathConstants.ts";
import { Avatar, ContentCardContainer, UserAvatarBadge, UserStats } from "@app/core/components";
import { UserProfileActions } from "@app/features/userProfile/UserProfileCard/UserProfileActions";

interface UserHoverCardProps {
    src: string | undefined;
    fullName: string | undefined | null;
    userName: string | undefined;
    isProfileIncognito: boolean | undefined;
    children: ReactNode;
    followersCount: number | undefined;
    followingCount: number | undefined;
    biography: string | undefined;
    disabled: boolean;
    isFollowedByCurrentUser: boolean | undefined;
    userProfileActionsShown: boolean;
    sx?: SxProps<Theme>;
}

export const UserHoverCard: FC<UserHoverCardProps> = ({
    children,
    disabled,
    userProfileActionsShown,
    src,
    userName,
    fullName,
    isProfileIncognito,
    biography,
    followingCount,
    isFollowedByCurrentUser,
    followersCount,
    sx,
}) => {
    const navigate: NavigateFunction = useNavigate();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const isMobile: boolean = useIsMobile();
    const open: boolean = Boolean(anchorEl) && !disabled;

    const handleNavigateToProfilePage = (_event: MouseEvent<HTMLElement>): void => {
        if (!userName) return;
        navigate(`/${USER_HANDLE_PREFIX}${userName}`);
    };

    const handleAction = (event: MouseEvent<HTMLElement>): void => {
        if (disabled) return;
        stopEventPropagation(event);

        if (isMobile) {
            handleNavigateToProfilePage(event);
        }
    };

    if (disabled || isMobile || !userName) {
        return (
            <Box component="span" onClick={handleAction} sx={sx}>
                {children}
            </Box>
        );
    }

    const handleOpen = (event: MouseEvent<HTMLElement>): void => {
        if (!disabled) {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleClose = (event: MouseEvent<HTMLElement>): void => {
        stopEventPropagation(event);
        setAnchorEl(null);
    };

    return (
        <Box component="span" onMouseEnter={handleOpen} onMouseLeave={handleClose} sx={sx}>
            {children}
            <Popper
                open={open}
                anchorEl={anchorEl}
                sx={{ zIndex: 1300 }}
                placement="bottom-start"
                onClick={stopEventPropagation}
            >
                <ContentCardContainer sx={{ p: 1 }}>
                    <CardHeader
                        sx={{
                            "& .MuiCardHeader-content": {
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.5,
                                alignSelf: "stretch",
                                justifyContent: "space-between",
                            },
                        }}
                        avatar={
                            <UserAvatarBadge
                                onClick={handleNavigateToProfilePage}
                                sx={{ "&:hover": { cursor: "pointer" } }}
                                isProfileIncognito={!!isProfileIncognito}
                            >
                                <Avatar alt={src} src={src} sx={{ width: 70, height: 70 }} userName={userName} />
                            </UserAvatarBadge>
                        }
                        title={
                            <Box
                                sx={{
                                    gap: 1,
                                    mb: 1,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "start",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Box>
                                    <Typography
                                        color="primary"
                                        variant="subtitle1"
                                        onClick={handleNavigateToProfilePage}
                                        sx={{
                                            "&:hover": {
                                                cursor: "pointer",
                                                textDecoration: "underline",
                                            },
                                        }}
                                    >
                                        @{userName}
                                    </Typography>
                                    {fullName && (
                                        <Typography textOverflow="ellipsis" color="text.secondary">
                                            {fullName}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        }
                    />

                    {typeof followersCount !== "undefined" && typeof followingCount !== "undefined" && (
                        <CardActions disableSpacing>
                            <UserStats
                                followersCount={followersCount}
                                followingCount={followingCount}
                                userName={userName}
                            />
                        </CardActions>
                    )}
                    {biography && (
                        <>
                            <Divider textAlign="left">
                                <Typography variant="subtitle1" color="primary">
                                    Biography
                                </Typography>
                            </Divider>
                            <CardContent>
                                <Typography variant="body1" color="textPrimary" sx={{ whiteSpace: "pre-wrap" }}>
                                    {biography}
                                </Typography>
                            </CardContent>
                        </>
                    )}
                    {userProfileActionsShown && typeof isFollowedByCurrentUser !== "undefined" && (
                        <UserProfileActions
                            userName={userName}
                            sx={{ width: "100%" }}
                            isFollowed={isFollowedByCurrentUser}
                        />
                    )}
                </ContentCardContainer>
            </Popper>
        </Box>
    );
};
