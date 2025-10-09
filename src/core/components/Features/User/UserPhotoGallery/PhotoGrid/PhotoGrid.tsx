import { Photo } from "@app/core/services";
import { useTheme } from "@app/core/providers";
import ImageList from "@mui/material/ImageList";
import EditIcon from "@mui/icons-material/Edit";
import ImageListItem from "@mui/material/ImageListItem";
import { ActionIconButton } from "@app/core/components";
import { Theme, useMediaQuery, alpha } from "@mui/material";
import { FC, MouseEvent, MouseEventHandler } from "react";
import ImageListItemBar from "@mui/material/ImageListItemBar";

interface PhotoGridProps {
    photos: Photo[];
    isOwner: boolean;
    onMenuOpen: (photo: Photo) => (event: MouseEvent<HTMLElement>) => void;
    onImageClick: (index: number, photo: Photo) => MouseEventHandler<HTMLImageElement> | undefined;
}

export const PhotoGrid: FC<PhotoGridProps> = memo(({ photos, isOwner, onImageClick, onMenuOpen }) => {
    const theme: Theme = useTheme();
    const isMobile: boolean = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet: boolean = useMediaQuery(theme.breakpoints.between("sm", "md"));

    const cols: number = useMemo((): number => {
        if (isMobile) return 1;
        if (isTablet) return 2;
        return 3;
    }, [isMobile, isTablet]);

    return (
        <ImageList cols={cols} gap={8} variant="masonry">
            {photos.map((item, index) => (
                <ImageListItem key={item.id}>
                    <img
                        loading="lazy"
                        alt={item.signedUrl}
                        src={item.signedUrl}
                        style={{ cursor: "pointer" }}
                        onClick={onImageClick(index, item)}
                    />
                    {isOwner && (
                        <ImageListItemBar
                            position="top"
                            sx={{ background: "transparent" }}
                            actionIcon={
                                <ActionIconButton
                                    icon={<EditIcon />}
                                    sx={theme => ({
                                        backgroundColor: alpha(theme.palette.common.black, 0.2),
                                        "&:hover": {
                                            backgroundColor: alpha(theme.palette.common.black, 0.4),
                                        },
                                    })}
                                    onClick={onMenuOpen(item)}
                                />
                            }
                            actionPosition="right"
                        />
                    )}
                </ImageListItem>
            ))}
        </ImageList>
    );
});
