import { FC } from "react";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Skeleton from "@mui/material/Skeleton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";

export const UserListItemSkeleton: FC = () => (
    <>
        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <Skeleton variant="circular" width={40} height={40} />
            </ListItemAvatar>
            <ListItemText
                primary={<Skeleton variant="text" width="30%" />}
                secondary={
                    <>
                        <Skeleton variant="text" width="50%" />
                        <Skeleton variant="text" width="80%" />
                    </>
                }
            />
            <Skeleton variant="rectangular" width={110} height={36} sx={{ borderRadius: 1, ml: 2 }} />
        </ListItem>
        <Divider variant="inset" component="li" />
    </>
);
