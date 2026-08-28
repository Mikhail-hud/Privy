export const MASONRY_GAP = 8;

export interface MasonryItem {
    id: string | number;
    width?: number | null;
    height?: number | null;
}

export interface MasonryTile<T extends MasonryItem> {
    item: T;
    index: number;
    top: number;
    left: number;
    width: number;
    height: number;
}

export interface MasonryLayout<T extends MasonryItem> {
    tiles: MasonryTile<T>[];
    containerHeight: number;
}

export const ComputeMasonryLayout = <T extends MasonryItem>(
    items: T[],
    cols: number,
    containerWidth: number,
    fallbackRatio: number
): MasonryLayout<T> => {
    if (cols <= 0 || containerWidth <= 0) return { tiles: [], containerHeight: 0 };

    const columnWidth: number = (containerWidth - MASONRY_GAP * (cols - 1)) / cols;
    const columnHeights: number[] = new Array<number>(cols).fill(0);

    const tiles: MasonryTile<T>[] = items.map((item, index) => {
        const ratio: number = item.width && item.height ? item.width / item.height : fallbackRatio;
        const height: number = columnWidth / ratio;

        let column = 0;
        for (let i = 1; i < cols; i++) {
            if (columnHeights[i] < columnHeights[column]) column = i;
        }

        const top: number = columnHeights[column];
        const left: number = column * (columnWidth + MASONRY_GAP);
        columnHeights[column] += height + MASONRY_GAP;

        return { item, index, top, left, width: columnWidth, height };
    });

    const containerHeight: number = columnHeights.length ? Math.max(...columnHeights) - MASONRY_GAP : 0;

    return { tiles, containerHeight };
};
