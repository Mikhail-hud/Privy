import Box from "@mui/material/Box";
import React, { MouseEvent } from "react";
import Backdrop from "@mui/material/Backdrop";
import CloseIcon from "@mui/icons-material/Close";
import { useBodyOverflowLock } from "@app/core/hooks";
import { ActionIconButton } from "@app/core/components";
import { stopEventPropagation } from "@app/core/utils/general.ts";

interface SingleThreadMediaBackdropProps {
    onClose: (e: MouseEvent<HTMLElement>) => void;
    open: boolean;
    src: string;
}

export const SingleThreadMediaBackdrop: React.FC<SingleThreadMediaBackdropProps> = ({ onClose, open, src }) => {
    useBodyOverflowLock(open);
    const handleBackdropClick = (e: MouseEvent<HTMLElement>) => {
        stopEventPropagation(e);
        onClose(e);
    };

    const handleImageClick = (e: MouseEvent<HTMLElement>): void => stopEventPropagation(e);

    return (
        <Backdrop
            open={open}
            onClick={handleBackdropClick}
            sx={{ zIndex: theme => theme.zIndex.drawer + 1, background: "black", touchAction: "none" }}
        >
            <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
                <Box sx={{ p: 2, position: "fixed", zIndex: 10 }}>
                    <ActionIconButton icon={<CloseIcon />} onClick={onClose} />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                        py: 1,
                    }}
                    onClick={handleBackdropClick}
                >
                    <img
                        src={src}
                        alt={src}
                        onClick={handleImageClick}
                        style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            borderRadius: "12px",
                        }}
                    />
                </Box>
            </Box>
        </Backdrop>
    );
};
