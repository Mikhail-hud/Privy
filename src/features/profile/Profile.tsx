import { FC } from "react";
import { useAuth } from "@app/core/hooks";
import { ProfileCard } from "@app/features/profile/ProfileCard";

export const Profile: FC = () => {
    const { profile } = useAuth();
    return <ProfileCard profile={profile} />;
};
