import { EMAIL_PATTERN, USER_NAME_PATTERN } from "@app/core/constants/patterns";

export const ISO_8601_YYYY_MM_DD_FORMAT = "YYYY-MM-DD";
export const MIN_AGE = 13;
export const MAX_PASSWORD_LENGTH = 128;
export const MIN_PASSWORD_LENGTH = 6;
export const USER_NAME_MIN_LENGTH = 3;
export const USER_NAME_MAX_LENGTH = 30;

export const FULL_NAME_MAX_LENGTH = 100;

export const VALIDATE_RELES = {
    THREAD_CONTENT: {
        required: "Content is required",
        maxLength: {
            value: 10000,
            message: "Content cannot exceed 10000 characters",
        },
    },
    BIOGRAPHY: {
        maxLength: {
            value: 500,
            message: "Biography cannot exceed 500 characters",
        },
    },
    FULL_NAME: {
        maxLength: {
            value: FULL_NAME_MAX_LENGTH,
            message: `Full Name cannot exceed ${FULL_NAME_MAX_LENGTH} characters`,
        },
    },

    BIRTHDATE: {
        required: "Birthdate is required",
    },
    PASSWORD: {
        required: "Password is required",
        minLength: {
            value: MIN_PASSWORD_LENGTH,
            message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
        },
        maxLength: {
            value: MAX_PASSWORD_LENGTH,
            message: `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters`,
        },
    },
    PASSWORD_REPEAT: {
        required: "Password Repeat is required",
    },
    EMAIL: {
        required: "Email is required",
        pattern: {
            value: EMAIL_PATTERN,
            message: "Please provide a valid email address.",
        },
    },
    USER_NAME: {
        minLength: {
            value: USER_NAME_MIN_LENGTH,
            message: `User Name must be at least ${USER_NAME_MIN_LENGTH} characters long`,
        },
        maxLength: {
            value: USER_NAME_MAX_LENGTH,
            message: `User Name must be at most ${USER_NAME_MAX_LENGTH} characters long`,
        },
        required: "User Name is required",
        pattern: {
            value: USER_NAME_PATTERN,
            message:
                "Allowed characters: alphanumeric (a-z, A-Z, 0-9), special characters: underscore (_), dot (.), hyphen (-).",
        },
    },
};
