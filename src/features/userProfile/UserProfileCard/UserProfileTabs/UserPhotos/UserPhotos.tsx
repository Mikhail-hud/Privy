import { FC, useMemo } from "react";
import { useLoaderData } from "react-router-dom";
import { UserPhotoGallery } from "@app/core/components";
import { UserProfilePhotosContext } from "@app/features/userProfile/UserProfileCard/UserProfileTabs/loaders";
import {
    Photo,
    PhotoListResponse,
    PhotoSlots,
    useGetUserPhotosInfiniteQuery,
    useGetUserProfileQuery,
} from "@app/core/services";

export const UserPhotos: FC = () => {
    const { params } = useLoaderData() as UserProfilePhotosContext;
    const { data, fetchNextPage, hasNextPage, isLoading, isFetching, isFetchingNextPage } =
        useGetUserPhotosInfiniteQuery(params);

    // Already in the cache, put there by `userProfileLoader` for the page around this tab; the gallery
    // needs it only to mark which photos are the avatars.
    const { data: user } = useGetUserProfileQuery(params.userName);

    const photos: Photo[] = useMemo<Photo[]>(
        (): Photo[] => data?.pages.flatMap((page: PhotoListResponse): Photo[] => page.data) ?? [],
        [data]
    );

    const photoSlots: PhotoSlots = useMemo<PhotoSlots>(
        (): PhotoSlots => ({ publicPhoto: user?.publicPhoto, privatePhoto: user?.privatePhoto }),
        [user?.publicPhoto, user?.privatePhoto]
    );

    return (
        <UserPhotoGallery
            photos={photos}
            photoSlots={photoSlots}
            isLoading={isLoading}
            isFetching={isFetching}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
        />
    );
};
