import { Photo } from "@app/core/services";
import { useTheme } from "@app/core/providers";
import ImageList from "@mui/material/ImageList";
import { Theme, useMediaQuery } from "@mui/material";
import { FC, MouseEvent, MouseEventHandler } from "react";
import { RATIO_16_9, RATIO_4_3 } from "@app/core/constants/general.ts";
import { PhotoGridItem } from "@app/core/components/Features/User/UserPhotoGallery/PhotoGrid/PhotoGridItem.tsx";

interface PhotoGridProps {
    photos: Photo[];
    isOwner: boolean;
    onMenuOpen: (photo: Photo) => (event: MouseEvent<HTMLElement>) => void;
    onImageClick: (index: number, photo: Photo) => MouseEventHandler<HTMLImageElement> | undefined;
}

export const PhotoGrid: FC<PhotoGridProps> = memo(({ photos, isOwner, onImageClick, onMenuOpen }) => {
    const theme: Theme = useTheme();
    const isLegacyMobile: boolean = useMediaQuery(theme.breakpoints.down("xs"));
    const isMobile: boolean = useMediaQuery(theme.breakpoints.between("xs", "sm"));
    const isTablet: boolean = useMediaQuery(theme.breakpoints.between("sm", "lg"));

    const ration: number = isMobile ? RATIO_4_3 : RATIO_16_9;

    const cols: number = useMemo((): number => {
        if (isLegacyMobile) return 1;
        if (isMobile) return 2;
        if (isTablet) return 3;
        return 4;
    }, [isTablet, isLegacyMobile, isMobile]);

    return (
        <ImageList cols={cols} gap={8} variant="masonry">
            {photos.map((item, index) => (
                <PhotoGridItem
                    key={item.id}
                    photo={item}
                    index={index}
                    isOwner={isOwner}
                    ration={ration}
                    onMenuOpen={onMenuOpen}
                    onImageClick={onImageClick}
                />
            ))}
        </ImageList>
    );
});
