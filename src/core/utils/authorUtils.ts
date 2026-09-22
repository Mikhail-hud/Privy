import { User } from "@app/core/services";

/**
 * The author-facing fields a thread and a reply have in common.
 *
 * Both are rendered by the same rules — an incognito post hides its author from everyone but its
 * owner — so the naming helpers below take this shape rather than either concrete type.
 */
export interface AuthoredContent {
    isIncognito: boolean;
    isOwnedByCurrentUser: boolean;
    author: User | null;
}

/** The name shown above a thread or reply, honouring incognito posts and marking your own. */
export const getAuthorDisplayName = ({ isIncognito, isOwnedByCurrentUser, author }: AuthoredContent): string => {
    if (isOwnedByCurrentUser && isIncognito) {
        return "You (Incognito)";
    }
    if (isOwnedByCurrentUser) {
        return `@${author?.userName} (You)`;
    }
    if (isIncognito) {
        return "Incognito User";
    }
    return `@${author?.userName}`;
};

/** The avatar shown next to a thread or reply, or `undefined` when there is nothing to show. */
export const getAuthorAvatarSrc = ({
    isIncognito,
    isOwnedByCurrentUser,
    author,
}: AuthoredContent): string | undefined => {
    if (isOwnedByCurrentUser) {
        return author?.publicPhoto?.src;
    }
    if (isIncognito) {
        return "undefined";
    }
    return author?.publicPhoto?.src || author?.privatePhoto?.src;
};
