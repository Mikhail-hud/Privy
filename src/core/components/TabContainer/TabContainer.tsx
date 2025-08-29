import { Typography } from "@mui/material";
import { FC, PropsWithChildren } from "react";

interface TabContainerProps extends PropsWithChildren {
    title: string;
}

export const TabContainer: FC<TabContainerProps> = ({ title, children }) => {
    return (
        <>
            <Typography variant="subtitle1" color="primary" sx={{ mt: 2, fontWeight: 100 }}>
                Content for: {title}
            </Typography>
            {children}
        </>
    );
};
