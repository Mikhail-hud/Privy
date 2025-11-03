import { FC } from "react";
import { Theme } from "@mui/material";
import Badge, { BadgeProps } from "@mui/material/Badge";
import { PrivateIcon, PublicIcon } from "@app/core/assets/icons";

interface UserAvatarBadgeProps extends BadgeProps {
    isProfileIncognito: boolean;
    fontSize?: "inherit" | "large" | "medium" | "small";
}

const avatarBadgeSx = (theme: Theme) => ({
    borderRadius: "50%",

    background: `linear-gradient(
        -45deg, 
        ${theme.palette.info.light}, 
        ${theme.palette.primary.main}, 
        ${theme.palette.info.main}, 
        ${theme.palette.primary.light}
    )`,
    backgroundSize: "400% 400%",
    animation: "gradientShimmer 3s ease infinite",
    color: theme.palette.info.contrastText,
    padding: "1px",
});

export const UserAvatarBadge: FC<UserAvatarBadgeProps> = memo(
    ({ isProfileIncognito, fontSize = "small", children, ...rest }) => (
        <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
                isProfileIncognito ? (
                    <PrivateIcon color="info" fontSize={fontSize} sx={avatarBadgeSx} />
                ) : (
                    <PublicIcon color="info" fontSize={fontSize} sx={avatarBadgeSx} />
                )
            }
            {...rest}
        >
            {children}
        </Badge>
    )
);
