import { FC } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import ListItem from "@mui/material/ListItem";
import { useIsMobile } from "@app/core/hooks";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";

export const ThreadListItemSkeleton: FC = () => {
    const isMobile = useIsMobile();
    return (
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
                            <Box
                                sx={{ my: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}
                            >
                                {Array.from({ length: 5 }).map((_, idx) => (
                                    <Skeleton
                                        key={idx}
                                        width="25%"
                                        variant="rectangular"
                                        sx={{ borderRadius: 2 }}
                                        height={isMobile ? 150 : 200}
                                    />
                                ))}
                            </Box>

                            <Box sx={{ display: "flex", gap: 1, mt: 1, ml: -1 }}>
                                {Array.from({ length: 4 }).map((_, idx) => (
                                    <Skeleton key={idx} variant="circular" width={32} height={32} />
                                ))}
                            </Box>
                        </Box>
                    }
                />
            </ListItem>
            <Divider variant="inset" component="li" />
        </>
    );
};
