import { Box } from "@mui/material";
import { useVirtualization } from "@app/core/components";
import { FC, ReactNode, RefObject, useLayoutEffect, useRef, useState } from "react";

const heightCache = new Map<string | number, number>();

interface VirtualizedItemProps {
    children: ReactNode;
    id: string | number;
}

export const VirtualizedItem: FC<VirtualizedItemProps> = ({ children, id }) => {
    const ref: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
    const { register, unregister } = useVirtualization();
    const [hasInit, setHasInit] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const [measuredHeight, setMeasuredHeight] = useState<number | null>(() => {
        return heightCache.get(id) || null;
    });

    useLayoutEffect(() => {
        const node: HTMLDivElement | null = ref.current;
        if (!node) return;

        register(node, isIntersecting => {
            setIsVisible(isIntersecting);
            setHasInit(prev => (prev ? prev : true));
        });

        const resizeObserver = new ResizeObserver(([entry]) => {
            if (entry.contentRect.height > 0) {
                const newHeight: number = entry.contentRect.height;
                if (heightCache.get(id) !== newHeight) {
                    heightCache.set(id, newHeight);
                    setMeasuredHeight(newHeight);
                }
            }
        });
        resizeObserver.observe(node);

        return (): void => {
            unregister(node);
            resizeObserver.disconnect();
        };
    }, [id, register, unregister]);

    const shouldRenderChildren: boolean = !hasInit || isVisible;

    return (
        <Box
            ref={ref}
            data-virtualized={!shouldRenderChildren}
            sx={{
                overflow: "hidden",
                boxSizing: "border-box",
                contain: shouldRenderChildren ? "none" : "strict",
                minHeight: !shouldRenderChildren && measuredHeight ? `${measuredHeight}px` : undefined,
            }}
        >
            {shouldRenderChildren ? children : null}
        </Box>
    );
};
