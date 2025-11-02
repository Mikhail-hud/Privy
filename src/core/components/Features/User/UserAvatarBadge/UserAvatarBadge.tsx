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
    background: theme.palette.mode === "light" ? theme.palette.background.paper : theme.palette.common.white,
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
