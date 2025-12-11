import { FC } from "react";
import { useLoaderData } from "react-router-dom";
import { UserProfileLoaderData } from "@app/features";
import { useGetUserProfileQuery, User } from "@app/core/services";
import { UserProfileCard } from "@app/features/userProfile/UserProfileCard";

export const UserProfile: FC = () => {
    const { userName } = useLoaderData() as UserProfileLoaderData;
    const { data } = useGetUserProfileQuery(userName);

    return <UserProfileCard user={data as User} />;
};
