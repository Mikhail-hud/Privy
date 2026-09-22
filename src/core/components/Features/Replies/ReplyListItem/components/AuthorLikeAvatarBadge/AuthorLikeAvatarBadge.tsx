import { FC } from "react";
import Badge, { BadgeProps } from "@mui/material/Badge";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface UserAvatarBadgeProps extends BadgeProps {
    fontSize?: "inherit" | "large" | "medium" | "small";
}

export const AuthorLikeAvatarBadge: FC<UserAvatarBadgeProps> = memo(({ children, ...rest }) => (
    <Badge
        overlap="rectangular"
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        badgeContent={<FavoriteIcon fontSize="small" color="info" />}
        {...rest}
    >
        {children}
    </Badge>
));
