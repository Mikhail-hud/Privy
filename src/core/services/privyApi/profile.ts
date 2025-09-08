import { PROFILE_PHOTOS_TAG, PROFILE_TAG, privyApi, User, UserGender, UserRole } from "@app/core/services";

export enum PhotoUploadType {
    PRIVATE = "PRIVATE",
    PUBLIC = "PUBLIC",
    SHARED = "SHARED",
}

export interface UploadPhotoPayload {
    file: File;
    type: PhotoUploadType;
}

export interface Photo {
    id: string;
    key: string;
    url: string;
    userId: number;
    createdAt: string;
}

export interface Profile extends User {
    id: number;
    userName: string;
    email: string;
    fullName: string;
    biography: string;
    age: number | string;
    gender: UserGender;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
    isProfileIncognito: boolean;
    publicPhoto: Photo | null;
    privatePhoto: Photo | null;
}

export type ProfileUpdatePayload = Partial<
    Pick<Profile, "fullName" | "biography" | "age" | "gender" | "isProfileIncognito">
>;

export const profileApi = privyApi.injectEndpoints({
    endpoints: builder => ({
        getProfile: builder.query<Profile, void>({
            query: (): string => "profile",
            providesTags: () => [PROFILE_TAG],
        }),
        updateProfile: builder.mutation<Profile, ProfileUpdatePayload>({
            query: (body: ProfileUpdatePayload): { url: string; method: string; body: ProfileUpdatePayload } => ({
                url: "profile",
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_, err) => (err ? [] : [PROFILE_TAG]),
        }),
        getProfilePhotos: builder.query<Photo[], void>({
            query: (): string => "profile/photos",
            providesTags: () => [PROFILE_PHOTOS_TAG],
        }),
        uploadPhoto: builder.mutation<Photo, UploadPhotoPayload>({
            query: ({ file, type }): { url: string; method: string; body: FormData } => {
                const formData = new FormData();
                formData.append("photo", file);
                formData.append("type", type);
                return {
                    url: "profile/photo",
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: (_, err) => (err ? [] : [PROFILE_TAG, PROFILE_PHOTOS_TAG]),
        }),
        setPublicPhoto: builder.mutation<Photo, string>({
            query: (photoId: string): { url: string; method: string } => ({
                url: `profile/photos/${photoId}/public`,
                method: "PUT",
            }),
            invalidatesTags: (_, err) => (err ? [] : [PROFILE_TAG]),
        }),

        setPrivatePhoto: builder.mutation<Photo, string>({
            query: (photoId: string): { url: string; method: string } => ({
                url: `profile/photos/${photoId}/private`,
                method: "PUT",
            }),
            invalidatesTags: (_, err) => (err ? [] : [PROFILE_TAG]),
        }),
        deleteProfilePhoto: builder.mutation<void, string>({
            query: (photoId: string): { url: string; method: string } => ({
                url: `profile/photos/${photoId}`,
                method: "DELETE",
            }),
            invalidatesTags: () => [PROFILE_TAG, PROFILE_PHOTOS_TAG],
        }),
        unsetPublicPhoto: builder.mutation<void, void>({
            query: (): { url: string; method: string } => ({
                url: `profile/photos/public`,
                method: "DELETE",
            }),
            invalidatesTags: () => [PROFILE_TAG, PROFILE_PHOTOS_TAG],
        }),
        unsetPrivatePhoto: builder.mutation<void, void>({
            query: (): { url: string; method: string } => ({
                url: `profile/photos/private`,
                method: "DELETE",
            }),
            invalidatesTags: () => [PROFILE_TAG, PROFILE_PHOTOS_TAG],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetProfileQuery,
    useUploadPhotoMutation,
    useDeleteProfilePhotoMutation,
    useUpdateProfileMutation,
    useGetProfilePhotosQuery,
    useSetPrivatePhotoMutation,
    useSetPublicPhotoMutation,
    useUnsetPrivatePhotoMutation,
    useUnsetPublicPhotoMutation,
} = profileApi;
