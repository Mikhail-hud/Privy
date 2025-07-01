import { PROFILE_TAG, unthreadsApi, User, UserRole } from "@app/core/services";

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER",
}

export interface ProfilePhoto {
    id: string;
    key: string;
    url: string;
    userId: number;
    createdAt: string;
}

export interface Profile extends User {
    id: number;
    username: string;
    email: string;
    fullName: string;
    bio: string;
    age: number;
    gender: Gender;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
    isProfileIncognito: boolean;
    profilePhoto: ProfilePhoto | null;
    profilePhotos: ProfilePhoto[];
}

export const profileApi = unthreadsApi.injectEndpoints({
    endpoints: builder => ({
        getProfile: builder.query<Profile, void>({
            query: (): string => "profile",
            providesTags: () => [PROFILE_TAG],
        }),
    }),
    overrideExisting: false,
});

export const { useGetProfileQuery } = profileApi;
