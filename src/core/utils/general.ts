import { FieldErrors, FieldValues } from "react-hook-form";
import { MouseEvent, SyntheticEvent, TouchEvent } from "react";

export const transformServerErrors = <T extends FieldValues>(
    errors: Record<keyof T, string> | undefined
): FieldErrors<T> | undefined => {
    if (!errors) return undefined;

    return Object.entries(errors).reduce<FieldErrors<T>>((acc, [field, message]) => {
        acc[field as keyof T] = {
            type: "manual",
            message,
        } as FieldErrors<T>[keyof T];

        return acc;
    }, {} as FieldErrors<T>);
};

export const stopEventPropagation = <T extends MouseEvent<HTMLElement> | TouchEvent<HTMLElement> | SyntheticEvent>(
    event: T
): void => {
    event.stopPropagation();
    event.preventDefault();
};
