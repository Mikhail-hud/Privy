/**
 * @file src/features/userProfile/loaders/userHandle.ts
 * Turns the `:userName` route param into the plain user name the API expects.
 */

import { USER_HANDLE_PREFIX } from "@app/core/constants/pathConstants";

/**
 * Strips the handle prefix from a `:userName` route param.
 *
 * The prefix is required rather than optional: `/@john` is a profile, `/john` is not, so a param
 * without it is a URL for something else entirely and must not be turned into an API request.
 *
 * @param {string | undefined} userName The raw `:userName` param.
 * @returns {string | null} The bare user name, or `null` when the param is missing or unprefixed.
 */
export const resolveUserHandle = (userName: string | undefined): string | null => {
    if (!userName || !userName.startsWith(USER_HANDLE_PREFIX)) {
        return null;
    }

    return userName.slice(USER_HANDLE_PREFIX.length);
};
