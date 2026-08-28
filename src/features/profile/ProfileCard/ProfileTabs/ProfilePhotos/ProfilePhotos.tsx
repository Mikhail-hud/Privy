import { useMemo } from "react";
import { useAuth } from "@app/core/hooks";
import { UserPhotoGallery } from "@app/core/components";
import { useLoaderData } from "react-router-dom";
import { Photo, useGetProfilePhotosInfiniteQuery } from "@app/core/services";
import { UserPhotosContext } from "@app/features/profile/ProfileCard/ProfileTabs/loaders";

export const ProfilePhotos = () => {
    const { profile } = useAuth();
    const { params } = useLoaderData() as UserPhotosContext;
    const { data, fetchNextPage, hasNextPage, isLoading, isFetching, isFetchingNextPage } =
        useGetProfilePhotosInfiniteQuery(params);

    const photos: Photo[] = useMemo(() => data?.pages.flatMap(page => page.data) ?? [], [data]);

    return (
        <UserPhotoGallery
            photos={photos}
            profile={profile}
            isOwner
            isLoading={isLoading}
            isFetching={isFetching}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
        />
    );
};
