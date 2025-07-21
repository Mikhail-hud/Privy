export const MAX_PASSWORD_LENGTH = 128;
export const MIN_PASSWORD_LENGTH = 6;

export const VALIDATE_RELES = {
    PASSWORD: {
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
};
