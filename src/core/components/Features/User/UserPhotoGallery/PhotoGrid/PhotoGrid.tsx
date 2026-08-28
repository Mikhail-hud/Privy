import Box from "@mui/material/Box";
import { Photo } from "@app/core/services";
import { useTheme } from "@app/core/providers";
import { Theme, useMediaQuery } from "@mui/material";
import { RATIO_16_9, RATIO_4_3 } from "@app/core/constants/general.ts";
import { VirtualizationProvider, VirtualizedItem } from "@app/core/components";
import { FC, MouseEvent, MouseEventHandler, useLayoutEffect, useMemo, useRef, useState } from "react";
import { PhotoGridItem } from "@app/core/components/Features/User/UserPhotoGallery/PhotoGrid/PhotoGridItem.tsx";
import { ComputeMasonryLayout } from "@app/core/components/Features/User/UserPhotoGallery/PhotoGrid/ComputeMasonryLayout.ts";
import { PhotoGridSkeletonItem } from "@app/core/components/Features/User/UserPhotoGallery/PhotoGrid/PhotoGridSkeletonItem.tsx";

interface PhotoSkeletonTile {
    id: string;
    width: number;
    height: number;
    isSkeleton: true;
}

type PhotoGridEntry = Photo | PhotoSkeletonTile;

const isSkeletonTile = (entry: PhotoGridEntry): entry is PhotoSkeletonTile => "isSkeleton" in entry;

const SKELETON_RATIOS: number[] = [RATIO_4_3, RATIO_16_9, 1, 3 / 4];

const buildSkeletonTiles = (count: number): PhotoSkeletonTile[] =>
    Array.from({ length: count }, (_, index) => ({
        id: `skeleton-${index}`,
        width: SKELETON_RATIOS[index % SKELETON_RATIOS.length],
        height: 1,
        isSkeleton: true,
    }));

interface PhotoGridProps {
    photos: Photo[];
    isOwner: boolean;
    isLoading?: boolean;
    isFetchingNextPage?: boolean;
    onMenuOpen: (photo: Photo) => (event: MouseEvent<HTMLElement>) => void;
    onImageClick: (index: number, photo: Photo) => MouseEventHandler<HTMLImageElement> | undefined;
}

export const PhotoGrid: FC<PhotoGridProps> = memo(
    ({ photos, isOwner, isLoading = false, isFetchingNextPage = false, onImageClick, onMenuOpen }) => {
        const theme: Theme = useTheme();
        const isLegacyMobile: boolean = useMediaQuery(theme.breakpoints.down("xs"));
        const isMobile: boolean = useMediaQuery(theme.breakpoints.between("xs", "sm"));
        const isTablet: boolean = useMediaQuery(theme.breakpoints.between("sm", "lg"));

        const ratio: number = isMobile ? RATIO_4_3 : RATIO_16_9;

        const cols: number = useMemo((): number => {
            if (isLegacyMobile) return 1;
            if (isMobile) return 2;
            if (isTablet) return 3;
            return 4;
        }, [isTablet, isLegacyMobile, isMobile]);

        const loadingCount: number = isLoading || isFetchingNextPage ? cols : 0;

        const containerRef = useRef<HTMLDivElement | null>(null);
        const [containerWidth, setContainerWidth] = useState<number>(0);

        useLayoutEffect(() => {
            const node: HTMLDivElement | null = containerRef.current;
            if (!node) return;

            const resizeObserver = new ResizeObserver(([entry]) => {
                setContainerWidth(entry.contentRect.width);
            });
            resizeObserver.observe(node);

            return () => resizeObserver.disconnect();
        }, []);

        const gridEntries: PhotoGridEntry[] = useMemo(
            () => [...photos, ...buildSkeletonTiles(loadingCount)],
            [photos, loadingCount]
        );

        const { tiles, containerHeight } = useMemo(
            () => ComputeMasonryLayout(gridEntries, cols, containerWidth, ratio),
            [gridEntries, cols, containerWidth, ratio]
        );

        return (
            <VirtualizationProvider>
                <Box ref={containerRef} sx={{ position: "relative", width: "100%", height: containerHeight, mt: 2 }}>
                    {tiles.map(({ item, index, top, left, width, height }) =>
                        isSkeletonTile(item) ? (
                            <PhotoGridSkeletonItem
                                key={item.id}
                                sx={{ position: "absolute", top, left, width, height }}
                            />
                        ) : (
                            <VirtualizedItem
                                key={item.id}
                                id={item.id}
                                sx={{ position: "absolute", top, left, width, height }}
                            >
                                <PhotoGridItem
                                    photo={item}
                                    index={index}
                                    isOwner={isOwner}
                                    onMenuOpen={onMenuOpen}
                                    onImageClick={onImageClick}
                                />
                            </VirtualizedItem>
                        )
                    )}
                </Box>
            </VirtualizationProvider>
        );
    }
);
