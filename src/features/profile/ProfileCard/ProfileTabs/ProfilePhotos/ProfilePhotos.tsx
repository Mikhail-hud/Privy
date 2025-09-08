import { UserPhotoGallery } from "@app/core/components";
import { useGetProfilePhotosQuery, useGetProfileQuery } from "@app/core/services";

export const ProfilePhotos = () => {
    const { data: profile } = useGetProfileQuery();
    const { data: photos = [] } = useGetProfilePhotosQuery();

    return <UserPhotoGallery photos={photos} profile={profile} isOwner />;
};
