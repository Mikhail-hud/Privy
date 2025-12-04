import { PROFILE_PHOTOS_TAG, PROFILE_TAG, privyApi, Profile } from "@app/core/services";

export interface UserLink {
    id: number;
    url: string;
    title: string;
}

interface CreateLinkPayload {
    title: string;
    url: string;
}

interface UpdateLinkPayload extends Partial<CreateLinkPayload> {
    id: number;
}

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
    mimeType: string;
    caption: string | null;
    originalFilename: string;
    src: string;
}

export type ProfileUpdatePayload = Partial<
    Pick<Profile, "fullName" | "biography" | "birthDate" | "gender" | "isProfileIncognito">
>;

export const profileApi = privyApi.injectEndpoints({
    endpoints: builder => ({
        getProfile: builder.query<Profile, void>({
            query: (): string => "profile",
            providesTags: (_response, err) => (err ? [] : [PROFILE_TAG]),
        }),
        updateProfile: builder.mutation<Profile, ProfileUpdatePayload>({
            query: (body: ProfileUpdatePayload): { url: string; method: string; body: ProfileUpdatePayload } => ({
                url: "profile",
                method: "PATCH",
                body,
            }),

            async onQueryStarted(_params, { dispatch, queryFulfilled }): Promise<void> {
                const { data } = await queryFulfilled;
                // Update the Profile cache
                dispatch(profileApi.util.upsertQueryData("getProfile", undefined, data));
            },
        }),
        updateProfileInterests: builder.mutation<Profile, { interests: number[] }>({
            query: (body: { interests: number[] }): { url: string; method: string; body: { interests: number[] } } => ({
                url: "profile/interests",
                method: "PUT",
                body,
            }),
            async onQueryStarted(_params, { dispatch, queryFulfilled }): Promise<void> {
                const { data } = await queryFulfilled;
                // Update the Profile cache
                dispatch(profileApi.util.upsertQueryData("getProfile", undefined, data));
            },
        }),
        createLink: builder.mutation<Profile, CreateLinkPayload>({
            query: (body: CreateLinkPayload): { url: string; method: string; body: CreateLinkPayload } => ({
                url: "profile/links",
                method: "POST",
                body,
            }),
            async onQueryStarted(_params, { dispatch, queryFulfilled }): Promise<void> {
                const { data } = await queryFulfilled;
                // Update the Profile cache
                dispatch(profileApi.util.upsertQueryData("getProfile", undefined, data));
            },
        }),
        updateLink: builder.mutation<Profile, UpdateLinkPayload>({
            query: (payload: UpdateLinkPayload): { url: string; method: string; body: Partial<CreateLinkPayload> } => {
                const { id, ...body } = payload;
                return {
                    url: `profile/links/${id}`,
                    method: "PATCH",
                    body,
                };
            },
            async onQueryStarted(_params, { dispatch, queryFulfilled }): Promise<void> {
                const { data } = await queryFulfilled;
                // Update the Profile cache
                dispatch(profileApi.util.upsertQueryData("getProfile", undefined, data));
            },
        }),
        deleteLink: builder.mutation<Profile, { id: number }>({
            query: ({ id }): { url: string; method: string } => ({
                url: `profile/links/${id}`,
                method: "DELETE",
            }),
            async onQueryStarted(_params, { dispatch, queryFulfilled }): Promise<void> {
                const { data } = await queryFulfilled;
                // Update the Profile cache
                dispatch(profileApi.util.upsertQueryData("getProfile", undefined, data));
            },
        }),
        getProfilePhotos: builder.query<Photo[], void>({
            query: (): string => "profile/photos",
            providesTags: (_response, err) => (err ? [] : [PROFILE_PHOTOS_TAG]),
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
            invalidatesTags: (_response, err) => (err ? [] : [PROFILE_TAG, PROFILE_PHOTOS_TAG]),
        }),
        setPublicPhoto: builder.mutation<Photo, string>({
            query: (photoId: string): { url: string; method: string } => ({
                url: `profile/photos/${photoId}/public`,
                method: "PUT",
            }),
            invalidatesTags: (_response, err) => (err ? [] : [PROFILE_TAG]),
        }),

        setPrivatePhoto: builder.mutation<Photo, string>({
            query: (photoId: string): { url: string; method: string } => ({
                url: `profile/photos/${photoId}/private`,
                method: "PUT",
            }),
            invalidatesTags: (_response, err) => (err ? [] : [PROFILE_TAG]),
        }),
        deleteProfilePhoto: builder.mutation<void, string>({
            query: (photoId: string): { url: string; method: string } => ({
                url: `profile/photos/${photoId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_response, err) => (err ? [] : [PROFILE_TAG, PROFILE_PHOTOS_TAG]),
        }),
        unsetPublicPhoto: builder.mutation<void, void>({
            query: (): { url: string; method: string } => ({
                url: `profile/photos/public`,
                method: "DELETE",
            }),
            invalidatesTags: (_response, err) => (err ? [] : [PROFILE_TAG]),
        }),
        unsetPrivatePhoto: builder.mutation<void, void>({
            query: (): { url: string; method: string } => ({
                url: `profile/photos/private`,
                method: "DELETE",
            }),
            invalidatesTags: (_response, err) => (err ? [] : [PROFILE_TAG]),
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
    useCreateLinkMutation,
    useDeleteLinkMutation,
    useUpdateLinkMutation,
    useUpdateProfileInterestsMutation,
} = profileApi;
