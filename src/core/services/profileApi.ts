import { apiClient, AUTH_KEYS, queryClient, Tag, UserGender, UserRole } from "@app/core/services";
import {
    useQuery,
    useMutation,
    UseQueryResult,
    UseQueryOptions,
    UseMutationResult,
    UseMutationOptions,
} from "@tanstack/react-query";

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

export interface Profile {
    id: number;
    userName: string;
    role: UserRole;
    email: string;
    interests: Tag[];
    fullName: string;
    biography: string;
    birthDate: string;
    gender: UserGender;
    createdAt: string;
    updatedAt: string;
    isProfileIncognito: boolean;
    publicPhoto: Photo | null;
    privatePhoto: Photo | null;
    followersCount: number;
    followingCount: number;
    links: UserLink[];
}

export type ProfileUpdatePayload = Partial<
    Pick<Profile, "fullName" | "biography" | "birthDate" | "gender" | "isProfileIncognito">
>;

export const PROFILE_KEYS = {
    all: ["profile"] as const,
    getProfile: () => [...PROFILE_KEYS.all, "getProfile"] as const,
    photos: () => [...PROFILE_KEYS.all, "photos"] as const,
};

const updateProfileQueryData = <K extends keyof Profile>(key: readonly string[], field: K, value: Profile[K]): void => {
    queryClient.setQueryData<Profile>(key, oldProfile => {
        if (!oldProfile) return oldProfile;
        return { ...oldProfile, [field]: value };
    });
};

export const profileApi = {
    getProfile: async (): Promise<Profile> => {
        return apiClient<Profile>({ url: "profile" });
    },
    updateProfile: async (body: ProfileUpdatePayload): Promise<Profile> => {
        return await apiClient<Profile>({
            url: "profile",
            method: "PATCH",
            body,
        });
    },

    updateProfileInterests: async (body: { interests: number[] }): Promise<Profile> => {
        return await apiClient<Profile>({
            url: "profile/interests",
            method: "PUT",
            body,
        });
    },

    createLink: async (body: CreateLinkPayload): Promise<Profile> => {
        return await apiClient<Profile>({
            url: "profile/links",
            method: "POST",
            body,
        });
    },

    updateLink: async (payload: UpdateLinkPayload): Promise<Profile> => {
        const { id, ...body } = payload;
        return await apiClient<Profile>({
            url: `profile/links/${id}`,
            method: "PATCH",
            body,
        });
    },

    deleteLink: async ({ id }: { id: number }): Promise<Profile> => {
        return await apiClient<Profile>({
            url: `profile/links/${id}`,
            method: "DELETE",
        });
    },

    getProfilePhotos: async (): Promise<Photo[]> => {
        return apiClient<Photo[]>({ url: "profile/photos" });
    },

    uploadPhoto: async ({ file, type }: UploadPhotoPayload): Promise<Photo> => {
        const formData = new FormData();
        formData.append("photo", file);
        formData.append("type", type);
        return await apiClient<Photo>({
            url: "profile/photo",
            method: "POST",
            body: formData,
        });
    },

    setPublicPhoto: async (photoId: string): Promise<Photo> => {
        return await apiClient<Photo>({
            url: `profile/photos/${photoId}/public`,
            method: "PUT",
        });
    },

    setPrivatePhoto: async (photoId: string): Promise<Photo> => {
        return await apiClient<Photo>({
            url: `profile/photos/${photoId}/private`,
            method: "PUT",
        });
    },

    deleteProfilePhoto: async (photoId: string): Promise<void> => {
        await apiClient<void>({
            url: `profile/photos/${photoId}`,
            method: "DELETE",
        });
    },

    unsetPublicPhoto: async (): Promise<void> => {
        await apiClient<void>({
            url: "profile/photos/public",
            method: "DELETE",
        });
    },

    unsetPrivatePhoto: async (): Promise<void> => {
        await apiClient<void>({
            url: "profile/photos/private",
            method: "DELETE",
        });
    },
};

export const useGetProfileQuery = (
    options?: Omit<UseQueryOptions<Profile>, "queryKey" | "queryFn">
): UseQueryResult<Profile, Error> => {
    return useQuery({
        queryKey: PROFILE_KEYS.getProfile(),
        queryFn: profileApi.getProfile,
        ...options,
    });
};

export const useUpdateProfileMutation = (
    options?: UseMutationOptions<Profile, Error, ProfileUpdatePayload>
): UseMutationResult<Profile, Error, ProfileUpdatePayload> => {
    return useMutation({
        mutationFn: profileApi.updateProfile,
        onSuccess: (profile: Profile): void => {
            queryClient.setQueryData(AUTH_KEYS.me(), profile);
            queryClient.setQueryData(PROFILE_KEYS.getProfile(), profile);
        },
        ...options,
    });
};

export const useUpdateProfileInterestsMutation = (
    options?: UseMutationOptions<Profile, Error, { interests: number[] }>
): UseMutationResult<Profile, Error, { interests: number[] }> => {
    return useMutation({
        mutationFn: profileApi.updateProfileInterests,
        onSuccess: (profile: Profile): void => {
            queryClient.setQueryData(AUTH_KEYS.me(), profile);
            queryClient.setQueryData(PROFILE_KEYS.getProfile(), profile);
        },
        ...options,
    });
};

export const useCreateLinkMutation = (
    options?: UseMutationOptions<Profile, Error, CreateLinkPayload>
): UseMutationResult<Profile, Error, CreateLinkPayload> => {
    return useMutation({
        mutationFn: profileApi.createLink,
        onSuccess: (profile: Profile): void => {
            queryClient.setQueryData(AUTH_KEYS.me(), profile);
            queryClient.setQueryData(PROFILE_KEYS.getProfile(), profile);
        },
        ...options,
    });
};

export const useUpdateLinkMutation = (
    options?: UseMutationOptions<Profile, Error, UpdateLinkPayload>
): UseMutationResult<Profile, Error, UpdateLinkPayload> => {
    return useMutation({
        mutationFn: profileApi.updateLink,
        onSuccess: (profile: Profile): void => {
            queryClient.setQueryData(AUTH_KEYS.me(), profile);
            queryClient.setQueryData(PROFILE_KEYS.getProfile(), profile);
        },
        ...options,
    });
};

export const useDeleteLinkMutation = (
    options?: UseMutationOptions<Profile, Error, { id: number }>
): UseMutationResult<Profile, Error, { id: number }> => {
    return useMutation({
        mutationFn: profileApi.deleteLink,
        onSuccess: (profile: Profile): void => {
            queryClient.setQueryData(AUTH_KEYS.me(), profile);
            queryClient.setQueryData(PROFILE_KEYS.getProfile(), profile);
        },
        ...options,
    });
};

export const useGetProfilePhotosQuery = (
    options?: Omit<UseQueryOptions<Photo[]>, "queryKey" | "queryFn">
): UseQueryResult<Photo[], Error> => {
    return useQuery({
        queryKey: PROFILE_KEYS.photos(),
        queryFn: profileApi.getProfilePhotos,
        ...options,
    });
};

export const useUploadPhotoMutation = (
    options?: UseMutationOptions<Photo, Error, UploadPhotoPayload>
): UseMutationResult<Photo, Error, UploadPhotoPayload> => {
    return useMutation({
        mutationFn: profileApi.uploadPhoto,
        onSuccess: (photo: Photo, { type }: UploadPhotoPayload): void => {
            if (type === PhotoUploadType.PRIVATE) {
                updateProfileQueryData(PROFILE_KEYS.getProfile(), "privatePhoto", photo);
                updateProfileQueryData(AUTH_KEYS.me(), "privatePhoto", photo);
            }
            if (type === PhotoUploadType.PUBLIC) {
                updateProfileQueryData(PROFILE_KEYS.getProfile(), "publicPhoto", photo);
                updateProfileQueryData(AUTH_KEYS.me(), "publicPhoto", photo);
            }

            queryClient.setQueryData<Photo[]>(PROFILE_KEYS.photos(), photos => {
                if (!photos) return photos;
                return [photo, ...photos];
            });
        },
        ...options,
    });
};

export const useDeleteProfilePhotoMutation = (
    options?: UseMutationOptions<void, Error, string>
): UseMutationResult<void, Error, string> => {
    return useMutation({
        mutationFn: profileApi.deleteProfilePhoto,
        onSuccess: (_void: void, photoId: string): void => {
            queryClient.setQueryData<Photo[]>(PROFILE_KEYS.photos(), oldPhotos => {
                if (!oldPhotos) return undefined;
                return oldPhotos.filter((photo: Photo): boolean => photo.id !== photoId);
            });

            const updateProfileCache = (key: readonly string[]) => {
                queryClient.setQueryData<Profile>(key, oldProfile => {
                    if (!oldProfile) return oldProfile;

                    const isPublicMatch: boolean = oldProfile.publicPhoto?.id === photoId;
                    const isPrivateMatch: boolean = oldProfile.privatePhoto?.id === photoId;

                    if (!isPublicMatch && !isPrivateMatch) return oldProfile;

                    return {
                        ...oldProfile,
                        publicPhoto: isPublicMatch ? null : oldProfile.publicPhoto,
                        privatePhoto: isPrivateMatch ? null : oldProfile.privatePhoto,
                    };
                });
            };

            updateProfileCache(PROFILE_KEYS.getProfile());
            updateProfileCache(AUTH_KEYS.me());
        },
        ...options,
    });
};

export const useSetPrivatePhotoMutation = (
    options?: UseMutationOptions<Photo, Error, string>
): UseMutationResult<Photo, Error, string> => {
    return useMutation({
        mutationFn: profileApi.setPrivatePhoto,
        onSuccess: (photo: Photo): void => {
            updateProfileQueryData(PROFILE_KEYS.getProfile(), "privatePhoto", photo);
            updateProfileQueryData(AUTH_KEYS.me(), "privatePhoto", photo);
        },
        ...options,
    });
};

export const useSetPublicPhotoMutation = (
    options?: UseMutationOptions<Photo, Error, string>
): UseMutationResult<Photo, Error, string> => {
    return useMutation({
        mutationFn: profileApi.setPublicPhoto,
        onSuccess: (photo: Photo): void => {
            updateProfileQueryData(PROFILE_KEYS.getProfile(), "publicPhoto", photo);
            updateProfileQueryData(AUTH_KEYS.me(), "publicPhoto", photo);
        },
        ...options,
    });
};

export const useUnsetPrivatePhotoMutation = (
    options?: UseMutationOptions<void, Error, void>
): UseMutationResult<void, Error, void> => {
    return useMutation({
        mutationFn: profileApi.unsetPrivatePhoto,
        onSuccess: (): void => {
            updateProfileQueryData(PROFILE_KEYS.getProfile(), "privatePhoto", null);
            updateProfileQueryData(AUTH_KEYS.me(), "privatePhoto", null);
        },
        ...options,
    });
};

export const useUnsetPublicPhotoMutation = (
    options?: UseMutationOptions<void, Error, void>
): UseMutationResult<void, Error, void> => {
    return useMutation({
        mutationFn: profileApi.unsetPublicPhoto,
        onSuccess: (): void => {
            updateProfileQueryData(PROFILE_KEYS.getProfile(), "publicPhoto", null);
            updateProfileQueryData(AUTH_KEYS.me(), "publicPhoto", null);
        },
        ...options,
    });
};
