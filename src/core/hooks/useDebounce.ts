import { useState, useEffect } from "react";
/**
 * Custom React hook that debounces a value by the specified delay.
 *
 * @template T
 * @param {T} value - The value to debounce.
 * @param {number} delay - Delay in milliseconds.
 * @returns {T} The debounced value.
 */
export const useDebounce = <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect((): (() => void) => {
        const timeout = setTimeout((): void => {
            setDebouncedValue(value);
        }, delay);

        return (): void => {
            clearTimeout(timeout);
        };
    }, [value, delay]);

    return debouncedValue;
};
