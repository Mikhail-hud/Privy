import Box from "@mui/material/Box";
import { Blurhash } from "react-blurhash";
import { Photo } from "@app/core/services";
import Skeleton from "@mui/material/Skeleton";
import EditIcon from "@mui/icons-material/Edit";
import { ActionIconButton } from "@app/core/components";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { FC, MouseEvent, MouseEventHandler, useState } from "react";

interface PhotoGridItemProps {
    photo: Photo;
    index: number;
    isOwner: boolean;
    ration: number;
    onMenuOpen: (photo: Photo) => (event: MouseEvent<HTMLElement>) => void;
    onImageClick: (index: number, photo: Photo) => MouseEventHandler<HTMLImageElement> | undefined;
}

export const PhotoGridItem: FC<PhotoGridItemProps> = ({ photo, index, isOwner, ration, onImageClick, onMenuOpen }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const aspectRatio: string | number = photo.width && photo.height ? `${photo.width} / ${photo.height}` : ration;

    const handleLoad = (): void => setIsLoaded(true);

    return (
        <ImageListItem>
            <Box
                sx={{
                    position: "relative",
                    borderRadius: "8px",
                    overflow: "hidden",
                    aspectRatio: aspectRatio,
                    cursor: "pointer",
                }}
                onClick={onImageClick(index, photo)}
            >
                {!isLoaded && (
                    <Box sx={{ position: "absolute", inset: 0, zIndex: 1 }}>
                        {photo.blurHash ? (
                            <Blurhash
                                hash={photo.blurHash}
                                width="100%"
                                height="100%"
                                resolutionX={32}
                                resolutionY={32}
                                punch={1}
                            />
                        ) : (
                            <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
                        )}
                    </Box>
                )}
                <img
                    loading="lazy"
                    alt={photo.src}
                    srcSet={`${photo.src}?w=161&fit=crop&auto=format&dpr=2 2x`}
                    src={`${photo.src}?w=161&fit=crop&auto=format`}
                    onLoad={handleLoad}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: isLoaded ? 1 : 0,
                        transition: "opacity 0.4s ease-in",
                    }}
                />
            </Box>

            {isOwner && (
                <ImageListItemBar
                    position="top"
                    actionPosition="right"
                    sx={{ background: "transparent" }}
                    actionIcon={<ActionIconButton icon={<EditIcon />} onClick={onMenuOpen(photo)} />}
                />
            )}
        </ImageListItem>
    );
};
