import { apiClient, queryClient } from "@app/core/services";
import { useMutation, UseMutationOptions, useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

export interface Tag {
    id: number;
    name: string;
}

interface UpdateTagPayload {
    id: number;
    name: string;
}

export const TAGS_KEYS = {
    all: ["tags"] as const,
    list: (name: string) => [...TAGS_KEYS.all, "list", name] as const,
    detail: (id: number) => [...TAGS_KEYS.all, "detail", id] as const,
};

export const tagsApi = {
    getTags: async ({ name }: { name: string }): Promise<Tag[]> => {
        return apiClient<Tag[]>({
            url: "tags",
            params: { name },
        });
    },

    getTagById: async ({ id }: { id: number }): Promise<Tag> => {
        return apiClient<Tag>({ url: `tags/${id}` });
    },

    createTag: async (body: { name: string }): Promise<Tag> => {
        return await apiClient<Tag>({
            url: "tags",
            method: "POST",
            body,
        });
    },

    updateTag: async ({ id, name }: UpdateTagPayload): Promise<Tag> => {
        return await apiClient<Tag>({
            url: `tags/${id}`,
            method: "PUT",
            body: { name },
        });
    },

    deleteTag: async ({ id }: { id: number }): Promise<void> => {
        await apiClient<void>({
            url: `tags/${id}`,
            method: "DELETE",
        });
    },
};

export const useGetTagsQuery = (
    payload: { name: string },
    options?: Omit<UseQueryOptions<Tag[]>, "queryKey" | "queryFn">
): UseQueryResult<Tag[], Error> => {
    return useQuery({
        queryKey: TAGS_KEYS.list(payload.name),
        queryFn: (): Promise<Tag[]> => tagsApi.getTags(payload),
        ...options,
    });
};

export const useGeTagByIdQuery = (
    payload: { id: number },
    options?: Omit<UseQueryOptions<Tag>, "queryKey" | "queryFn">
): UseQueryResult<Tag, Error> => {
    return useQuery({
        queryKey: TAGS_KEYS.detail(payload.id),
        queryFn: (): Promise<Tag> => tagsApi.getTagById(payload),
        enabled: !!payload.id,
        ...options,
    });
};

export const useCreateTagMutation = (options?: UseMutationOptions<Tag, Error, { name: string }>) => {
    return useMutation({
        mutationFn: tagsApi.createTag,
        onSuccess: (_tag: Tag): void => {
            // TODO Optimize by adding to existing cache instead of invalidating
            queryClient.invalidateQueries({ queryKey: TAGS_KEYS.all });
        },
        ...options,
    });
};

export const useUpdateTagMutation = (options?: UseMutationOptions<Tag, Error, UpdateTagPayload>) => {
    return useMutation({
        mutationFn: tagsApi.updateTag,
        onSuccess: (tag: Tag, { id }: UpdateTagPayload): void => {
            queryClient.setQueryData(TAGS_KEYS.detail(id), tag);

            queryClient.setQueriesData<Tag[]>({ queryKey: TAGS_KEYS.all }, oldTags => {
                if (!oldTags || !Array.isArray(oldTags)) return oldTags;
                return oldTags.map(tag => (tag.id === id ? tag : tag));
            });
        },
        ...options,
    });
};

export const useDeleteTagMutation = (options?: UseMutationOptions<void, Error, { id: number }>) => {
    return useMutation({
        mutationFn: tagsApi.deleteTag,
        onSuccess: (_data: void, { id }: { id: number }): void => {
            queryClient.removeQueries({ queryKey: TAGS_KEYS.detail(id) });
            queryClient.setQueriesData<Tag[]>({ queryKey: TAGS_KEYS.all }, oldTags => {
                if (!oldTags) return oldTags;
                return oldTags.filter(tag => tag.id !== id);
            });
        },
        ...options,
    });
};
