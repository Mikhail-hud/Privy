import { FC } from "react";
import { Box, ListItem, Skeleton, Divider, ListItemText, ListItemAvatar } from "@mui/material";

export const ThreadListItemSkeleton: FC = () => (
    <>
        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <Skeleton variant="circular" width={40} height={40} />
            </ListItemAvatar>
            <ListItemText
                slotProps={{ secondary: { component: "div" } }}
                primary={
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                        <Skeleton variant="text" width={120} />
                        <Skeleton variant="text" width={60} />
                    </Box>
                }
                secondary={
                    <Box>
                        <Skeleton variant="text" width="100%" />
                        <Skeleton variant="text" width="90%" />
                        <Skeleton variant="text" width="40%" />
                        {/*<Skeleton variant="rectangular" width="100%" height={100} sx={{ borderRadius: 2, my: 1 }} />*/}
                        <Box sx={{ display: "flex", gap: 1, mt: 1, ml: -1 }}>
                            <Skeleton variant="circular" width={32} height={32} />
                            <Skeleton variant="circular" width={32} height={32} />
                            <Skeleton variant="circular" width={32} height={32} />
                            <Skeleton variant="circular" width={32} height={32} />
                        </Box>
                    </Box>
                }
            />
        </ListItem>
        <Divider variant="inset" component="li" />
    </>
);
