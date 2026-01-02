import Link from "@mui/material/Link";
import { FC, useState, MouseEvent } from "react";
import Typography from "@mui/material/Typography";
import { stopEventPropagation } from "@app/core/utils/general.ts";

interface ReadMoreProps {
    text: string;
    limit?: number;
}

export const ReadMore: FC<ReadMoreProps> = ({ text }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = useState(false);
    const [isClamped, setIsClamped] = useState(false);

    const toggleExpand = (e: MouseEvent) => {
        stopEventPropagation(e);
        setExpanded(!expanded);
    };

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        setIsClamped(el.scrollHeight > el.clientHeight);
    }, [text]);

    return (
        <>
            <Typography
                ref={ref}
                variant="body2"
                color="text.primary"
                sx={{
                    whiteSpace: "pre-wrap",
                    display: "-webkit-box",
                    WebkitLineClamp: expanded ? "none" : 7,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                }}
            >
                {text}
            </Typography>
            {isClamped && (
                <Link
                    variant="body2"
                    component="button"
                    color="primary"
                    onClick={toggleExpand}
                    sx={{
                        mt: 1,
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                    }}
                >
                    {expanded ? "...Show less" : "...More"}
                </Link>
            )}
        </>
    );
};
