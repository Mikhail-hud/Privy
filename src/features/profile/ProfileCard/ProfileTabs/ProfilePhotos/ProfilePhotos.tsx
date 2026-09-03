import { useMemo, useState } from "react";
import { useAuth } from "@app/core/hooks";
import { useLoaderData } from "react-router-dom";
import { UserPhotoGallery } from "@app/core/components";
import { Photo, useGetProfilePhotosInfiniteQuery } from "@app/core/services";
import { UserPhotosContext } from "@app/features/profile/ProfileCard/ProfileTabs/loaders";
import { GalleryPhotoUpload } from "@app/core/components/Features/User/UserPhotoGallery/GalleryPhotoUpload";

export const ProfilePhotos = () => {
    const { profile } = useAuth();
    const { params } = useLoaderData() as UserPhotosContext;
    const { data, fetchNextPage, hasNextPage, isLoading, isFetching, isFetchingNextPage } =
        useGetProfilePhotosInfiniteQuery(params);

    const [uploadOpen, setUploadOpen] = useState<boolean>(false);

    const photos: Photo[] = useMemo(() => data?.pages.flatMap(page => page.data) ?? [], [data]);

    const handleOnUploadClick = (): void => setUploadOpen(true);

    return (
        <>
            <GalleryPhotoUpload open={uploadOpen} onOpenChange={setUploadOpen} />
            <UserPhotoGallery
                isOwner
                photos={photos}
                profile={profile}
                isLoading={isLoading}
                isFetching={isFetching}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
                onUploadClick={handleOnUploadClick}
                isFetchingNextPage={isFetchingNextPage}
            />
        </>
    );
};
