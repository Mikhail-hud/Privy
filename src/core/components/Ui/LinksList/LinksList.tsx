import { FC } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { UserLink } from "@app/core/services";
import Typography from "@mui/material/Typography";

interface LinksListProps {
    links?: UserLink[];
}

export const LinksList: FC<LinksListProps> = memo(({ links }) => {
    if (!links || !links.length) {
        return null;
    }

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            <Typography variant="body2" color="textSecondary">
                Links:
            </Typography>
            {links.map(link => (
                <Link
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    variant="body2"
                    underline="hover"
                    rel="noopener noreferrer"
                    color="textSecondary"
                >
                    {link.title}
                </Link>
            ))}
        </Box>
    );
});
