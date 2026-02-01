export const EMAIL_PATTERN: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const USER_NAME_PATTERN: RegExp = /^[a-zA-Z0-9_.-]{3,30}$/;
export const LINK_PATTERN: RegExp = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
export const ALLOWED_IMAGE_MIME_TYPES: RegExp = /^(image\/(jpeg|png|gif|webp|svg\+xml))$/i;
export const ALLOWED_POST_MIME_TYPES: RegExp = /^(image\/(jpeg|png|gif|webp)|video\/.*)$/;

export const POST_ACCEPT_ATTRIBUTE = "image/jpeg,image/png,image/gif,image/webp,video/*";
export const MAX_IMAGE_INPUT_SIZE: number = 30 * 1024 * 1024;
export const COMPRESSED_IMAGE_SIZE: number = 5 * 1024 * 1024;

export const MAX_VIDEO_INPUT_SIZE: number = 250 * 1024 * 1024;
export const MAX_FILES_COUNT = 10;
