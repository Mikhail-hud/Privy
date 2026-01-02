import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Extend dayjs with the relativeTime plugin. This should only be done once in your app.
// If you use dayjs in multiple places, ensure you do not duplicate this extension.
// Consider moving this initialization to a shared config file (e.g., src/core/utils/dayjsConfig.ts).
dayjs.extend(relativeTime);

/**
 * Returns a relative time string (e.g., "2 hours ago", "in a minute").
 *
 * @param dateString - A date string (ISO 8601 or any format supported by dayjs)
 * @returns {string} Formatted relative time string, or an empty string if input is invalid
 *
 * @example
 * getRelativeTime("2025-12-22T10:00:00Z"); // "in 2 hours" (if now is 2025-12-22T08:00:00Z)
 */
export const getRelativeTime = (dateString: string): string => {
    if (!dateString) return "";
    return dayjs(dateString).fromNow();
};
