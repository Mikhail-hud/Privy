import { useEffect } from "react";

export const useBodyOverflowLock = (lock: boolean): void => {
    useEffect(() => {
        if (lock) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return (): void => {
            document.body.style.overflow = "unset";
        };
    }, [lock]);
};
