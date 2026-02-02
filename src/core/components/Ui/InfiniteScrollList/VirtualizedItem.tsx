import { Box } from "@mui/material";
import { FC, ReactNode, useLayoutEffect, useRef, useState } from "react";

const heightCache = new Map<string | number, number>();

interface VirtualizedItemProps {
    children: ReactNode;
    id: string | number;
    estimatedHeight?: number;
}

export const VirtualizedItem: FC<VirtualizedItemProps> = ({ children, id }) => {
    const ref = useRef<HTMLDivElement>(null);
    const hasInit = useRef<boolean>(false);
    const [isVisible, setIsVisible] = useState(false);

    const [measuredHeight, setMeasuredHeight] = useState<number | null>(() => {
        return heightCache.get(id) || null;
    });

    useLayoutEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]): void => {
                setIsVisible(entry.isIntersecting);
                hasInit.current = true;
            },
            { rootMargin: "800px 0px 800px 0px" }
        );
        observer.observe(node);

        const resizeObserver = new ResizeObserver(([entry]) => {
            if (entry.contentRect.height > 0) {
                const newHeight: number = Math.round(entry.contentRect.height);
                if (heightCache.get(id) !== newHeight) {
                    heightCache.set(id, newHeight);
                    setMeasuredHeight(newHeight);
                }
            }
        });
        resizeObserver.observe(node);

        return (): void => {
            observer.disconnect();
            resizeObserver.disconnect();
        };
    }, [id]);

    const shouldRenderChildren: boolean = !hasInit.current || isVisible;

    return (
        <Box
            ref={ref}
            data-virtualized={!shouldRenderChildren}
            sx={{ minHeight: !shouldRenderChildren && measuredHeight ? `${measuredHeight}px` : undefined }}
        >
            {shouldRenderChildren ? children : null}
        </Box>
    );
};
