export const isValidEmail = (value: string): boolean => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
};

export const isValidUsername = (value: string): boolean => {
    return /^[a-zA-Z0-9_.-]{3,30}$/.test(value);
};
