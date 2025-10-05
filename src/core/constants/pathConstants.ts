export const ROOT_PATH = "/";
export const PROFILE_PAGE_PATH = "/profile";
export const PROFILE_FAVORITES_TAB_PATH = "/profile/favorites";
export const PROFILE_REPLIES_TAB_PATH = "/profile/replies";
export const PROFILE_PHOTOS_TAB_PATH = "/profile/photos";
export const PROFILE_REVEALS_TAB_PATH = "/profile/reveals";

export const DIALOGS_PAGE_PATH = "/dialogs";
export const FAVORITES_PAGE_PATH = "/favorites";
export const DASHBOARD_PAGE_PATH = "/dashboard";
export const SETTINGS_PAGE_PATH = "/settings";
export const SIGN_IN_PAGE_PATH = "/sign-in";
export const SIGN_UP_PAGE_PATH = "/sign-up";
export const RESET_PASSWORD_PATH = "/reset-password";
export const NOT_FOUND_PAGE_PATH = "*";

export const PUBLIC_ROUTES = [RESET_PASSWORD_PATH, SIGN_IN_PAGE_PATH, SIGN_UP_PAGE_PATH] as const;

// Root ID for the main layout
export const ROOT_ID = "root";

// Action-only route, no element
export const SIGN_OUT_ACTION_ONLY_PATH = "/sign-out";

// Params Keys
export const TOKEN_PARAM_KEY = "token";
