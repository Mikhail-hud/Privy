import { FieldErrors, FieldValues } from "react-hook-form";

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
