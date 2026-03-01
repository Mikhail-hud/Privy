import { User } from "@app/core/services";
import { Popover, Box } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useIsMobile } from "@app/core/hooks";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { NavigateFunction } from "react-router-dom";
import { FC, useState, MouseEvent, ReactNode } from "react";
import { stopEventPropagation } from "@app/core/utils/general.ts";
import { ContentCardContainer, UserStats } from "@app/core/components";
import { USER_HANDLE_PREFIX } from "@app/core/constants/pathConstants.ts";
import { UserProfileAvatar } from "@app/features/userProfile/UserProfileCard/UserProfileAvatar";
import { UserProfileActions } from "@app/features/userProfile/UserProfileCard/UserProfileActions";

interface UserHoverCardProps {
    user: User | null;
    children: ReactNode;
    disabled: boolean;
    userProfileActionsShown: boolean;
}

export const UserHoverCard: FC<UserHoverCardProps> = ({ user, children, disabled, userProfileActionsShown }) => {
    const navigate: NavigateFunction = useNavigate();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const isMobile: boolean = useIsMobile();
    const open: boolean = Boolean(anchorEl) && !disabled && Boolean(user);

    const handleNavigateToProfilePage = (_event: MouseEvent<HTMLElement>): void => {
        if (!user?.userName) return;
        navigate(`/${USER_HANDLE_PREFIX}${user.userName}`);
    };

    const handleAction = (event: MouseEvent<HTMLElement>): void => {
        if (disabled || !user) return;
        stopEventPropagation(event);

        if (isMobile) {
            handleNavigateToProfilePage(event);
        }
    };

    if (disabled || !user || isMobile) {
        return <Box onClick={handleAction}>{children}</Box>;
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

    const onPaperMouseEnter = (): void => setAnchorEl(anchorEl);

    return (
        <Box component="span" onMouseEnter={handleOpen} onMouseLeave={handleClose} sx={{ display: "inline-block" }}>
            {children}
            <Popover
                onClick={stopEventPropagation}
                open={open}
                anchorEl={anchorEl}
                disableRestoreFocus
                sx={{ pointerEvents: "none" }}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                disablePortal={false}
                slotProps={{
                    paper: {
                        onMouseEnter: onPaperMouseEnter,
                        onMouseLeave: handleClose,
                        sx: {
                            pointerEvents: "auto",
                            overflow: "visible",
                            "&::before": {
                                content: '""',
                                display: "block",
                                position: "absolute",
                                top: -32,
                                left: 0,
                                right: 0,
                                height: 32,
                                background: "transparent",
                            },
                        },
                    },
                }}
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
                            <UserProfileAvatar
                                width={70}
                                height={70}
                                userName={user?.userName}
                                publicPhoto={user?.publicPhoto}
                                privatePhoto={user?.privatePhoto}
                                canViewFullProfile={user?.canViewFullProfile}
                                isProfileIncognito={user?.isProfileIncognito}
                            />
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
                                        @{user?.userName}
                                    </Typography>
                                    {user?.fullName && (
                                        <Typography textOverflow="ellipsis" color="text.secondary">
                                            {user?.fullName}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        }
                    />

                    <CardActions disableSpacing>
                        <UserStats
                            followersCount={user?.followersCount}
                            followingCount={user?.followingCount}
                            userName={user?.userName}
                        />
                    </CardActions>
                    {user?.biography && (
                        <>
                            <Divider textAlign="left">
                                <Typography variant="subtitle1" color="primary">
                                    Biography
                                </Typography>
                            </Divider>
                            <CardContent>
                                <Typography variant="body1" color="textPrimary" sx={{ whiteSpace: "pre-wrap" }}>
                                    {user?.biography}
                                </Typography>
                            </CardContent>
                        </>
                    )}
                    {userProfileActionsShown && (
                        <UserProfileActions
                            userName={user?.userName}
                            isFollowed={user?.isFollowedByCurrentUser}
                            sx={{ width: "100%" }}
                        />
                    )}
                </ContentCardContainer>
            </Popover>
        </Box>
    );
};
