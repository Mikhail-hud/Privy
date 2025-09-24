import { alpha } from "@mui/material";
import { Photo } from "@app/core/services";
import { useTheme } from "@app/core/providers";
import ImageList from "@mui/material/ImageList";
import EditIcon from "@mui/icons-material/Edit";
import { Theme, useMediaQuery } from "@mui/material";
import ImageListItem from "@mui/material/ImageListItem";
import { FC, MouseEvent, MouseEventHandler } from "react";
import { ActionIconButton } from "@app/core/components";
import ImageListItemBar from "@mui/material/ImageListItemBar";

interface PhotoGridProps {
    photos: Photo[];
    isOwner: boolean;
    onMenuOpen: (photo: Photo) => (event: MouseEvent<HTMLElement>) => void;
    onImageClick: (index: number, photo: Photo) => MouseEventHandler<HTMLImageElement> | undefined;
}

export const PhotoGrid: FC<PhotoGridProps> = memo(({ photos, isOwner, onImageClick, onMenuOpen }) => {
    console.log("PhotoGrid render");
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
                        alt={item.url}
                        style={{ cursor: "pointer" }}
                        onClick={onImageClick(index, item)}
                        src={`${item.url}?w=248&fit=crop&auto=format`}
                        srcSet={`${item.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    />
                    {isOwner && (
                        <ImageListItemBar
                            position="top"
                            sx={{ background: "transparent" }}
                            actionIcon={
                                <ActionIconButton
                                    icon={<EditIcon />}
                                    sx={theme => ({
                                        color: "primary.main",
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
