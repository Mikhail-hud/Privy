import { EMAIL_PATTERN, USER_NAME_PATTERN } from "@app/core/constants/patterns.ts";

export const isValidEmail = (value: string): boolean => {
    return EMAIL_PATTERN.test(value);
};

export const isValidUsername = (value: string): boolean => {
    return USER_NAME_PATTERN.test(value);
};
