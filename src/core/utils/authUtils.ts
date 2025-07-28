export const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const USER_NAME_PATTERN = /^[a-zA-Z0-9_.-]{3,30}$/;

export const isValidEmail = (value: string): boolean => {
    return EMAIL_PATTERN.test(value);
};

export const isValidUsername = (value: string): boolean => {
    return USER_NAME_PATTERN.test(value);
};
