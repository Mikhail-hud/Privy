import Card from "@mui/material/Card";
import { FC, PropsWithChildren } from "react";

export const ContentCardContainer: FC<PropsWithChildren> = ({ children }) => (
    <Card variant="outlined" sx={{ maxWidth: 800, margin: "auto", height: "100%" }}>
        {children}
    </Card>
);
