import { LINKS_TAG, privyApi, PROFILE_TAG } from "@app/core/services";

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

export const linksApi = privyApi.injectEndpoints({
    endpoints: builder => ({
        getUserLinks: builder.query<UserLink[], number>({
            query: (userId: number): { url: string } => ({
                url: `links/${userId}`,
            }),
            providesTags: () => [LINKS_TAG],
        }),
        createLink: builder.mutation<UserLink, CreateLinkPayload>({
            query: (body: CreateLinkPayload): { url: string; method: string; body: CreateLinkPayload } => ({
                url: "links",
                method: "POST",
                body,
            }),
            invalidatesTags: (_, err) => (err ? [] : [LINKS_TAG, PROFILE_TAG]),
        }),
        updateLink: builder.mutation<UserLink, UpdateLinkPayload>({
            query: (payload: UpdateLinkPayload): { url: string; method: string; body: Partial<CreateLinkPayload> } => {
                const { id, ...body } = payload;
                return {
                    url: `links/${id}`,
                    method: "PATCH",
                    body,
                };
            },
            invalidatesTags: (_, err, { id }) => (err ? [] : [{ type: LINKS_TAG, id }, PROFILE_TAG]),
        }),
        deleteLink: builder.mutation<void, { id: number }>({
            query: ({ id }): { url: string; method: string } => ({
                url: `links/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_, err) => (err ? [] : [LINKS_TAG, PROFILE_TAG]),
        }),
    }),
    overrideExisting: false,
});

export const { useGetUserLinksQuery, useCreateLinkMutation, useDeleteLinkMutation, useUpdateLinkMutation } = linksApi;
