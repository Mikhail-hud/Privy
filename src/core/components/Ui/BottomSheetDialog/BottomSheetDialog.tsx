import { FC, TouchEvent, useRef, useState } from "react";
import Dialog, { DialogProps } from "@mui/material/Dialog";

// TODO: Fix Touch actions
export const BottomSheetDialog: FC<DialogProps> = ({ open, onClose, children, ...props }) => {
    const paperRef = useRef<HTMLDivElement>(null);
    const startY = useRef<number>(0);
    const [closing, setClosing] = useState(false);

    const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        startY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
        if (!paperRef.current) {
            return;
        }
        const delta = e.touches[0].clientY - startY.current;
        if (delta > 0) {
            paperRef.current.style.transform = `translateY(${delta}px)`;
        }
    };

    const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
        const delta = e.changedTouches[0].clientY - startY.current;

        if (!paperRef.current) {
            return;
        }
        if (delta > 80) {
            setClosing(true);
            paperRef.current.style.transform = "";
        } else {
            paperRef.current.style.transform = "";
        }
    };

    return (
        <Dialog
            open={open}
            onClose={(event, reason) => {
                if (onClose) {
                    onClose(event, reason);
                }
                setClosing(true);
            }}
            slotProps={{
                paper: {
                    ref: paperRef,
                    className: closing ? "closing" : "",
                    onAnimationEnd: () => setClosing(false),
                    onTouchStart: handleTouchStart,
                    onTouchMove: handleTouchMove,
                    onTouchEnd: handleTouchEnd,
                },
            }}
            {...props}
        >
            <div
                style={{
                    width: 40,
                    height: 5,
                    background: "#bbb",
                    borderRadius: 3,
                    margin: "8px auto",
                }}
            />
            {children}
        </Dialog>
    );
};
