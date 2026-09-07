import { MediaStatus, MediaType, ThreadMedia } from "@app/core/services";

/**
 * True while a video is still being transcoded on the server.
 *
 * Such media has no `src` at all — the raw upload is deliberately never served — so it must not be
 * handed to a `<video>` element, registered for autoplay or opened in the lightbox.
 */
export const isMediaProcessing = (media: ThreadMedia): boolean => media.status === MediaStatus.PROCESSING;

/** True when transcoding failed: there will never be a playable file for this row. */
export const isMediaFailed = (media: ThreadMedia): boolean => media.status === MediaStatus.FAILED;

/**
 * True when the media can actually be rendered.
 *
 * Images are always playable; videos only once the transcode produced an MP4. `status` is optional in
 * the API type, so an absent status is treated as ready — that is how images come back.
 */
export const isMediaPlayable = (media: ThreadMedia): boolean =>
    media.type === MediaType.VIDEO ? media.status === MediaStatus.READY && !!media.src : !!media.src;
