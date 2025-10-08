import { privyApi, TAG_TAG } from "@app/core/services";

export interface Tag {
    id: number;
    createdAt: string;
    name: string;
}

interface UpdateTagPayload {
    id: number;
    name: string;
}

export const tagsApi = privyApi.injectEndpoints({
    endpoints: builder => ({
        getTags: builder.query<Tag[], { name: string }>({
            query: ({ name }) => ({
                url: "tags",
                params: { name },
            }),
            providesTags: () => [TAG_TAG],
        }),

        geTagById: builder.query<Tag, { id: number }>({
            query: ({ id }): string => `tags/${id}`,
            providesTags: () => [TAG_TAG],
        }),
        createTag: builder.mutation<Tag, { name: string }>({
            query: (body: { name: string }): { url: string; method: string; body: { name: string } } => ({
                url: "tags",
                method: "POST",
                body,
            }),
            invalidatesTags: (_, err) => (err ? [] : [TAG_TAG]),
        }),
        updateTag: builder.mutation<Tag, UpdateTagPayload>({
            query: ({ id, name }): { url: string; method: string; body: { name: string } } => ({
                url: `tags/${id}`,
                method: "PUT",
                body: { name },
            }),
            invalidatesTags: (_, err, { id }) => (err ? [] : [{ type: TAG_TAG, id }]),
        }),
        deleteTag: builder.mutation<void, { id: number }>({
            query: ({ id }): { url: string; method: string } => ({
                url: `tags/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_, err) => (err ? [] : [TAG_TAG]),
        }),
    }),
    overrideExisting: false,
});

export const { useGetTagsQuery, useGeTagByIdQuery, useCreateTagMutation, useDeleteTagMutation, useUpdateTagMutation } =
    tagsApi;
