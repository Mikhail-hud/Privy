import { useAuth } from "@app/core/hooks";
import { UserPhotoGallery } from "@app/core/components";
import { useGetProfilePhotosQuery } from "@app/core/services";

export const ProfilePhotos = () => {
    const { profile } = useAuth();
    const { data = [] } = useGetProfilePhotosQuery();
    return <UserPhotoGallery photos={data} profile={profile} isOwner />;
};
