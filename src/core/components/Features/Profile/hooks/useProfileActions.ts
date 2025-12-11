import {
    Photo,
    useSetPublicPhotoMutation,
    useSetPrivatePhotoMutation,
    useUnsetPublicPhotoMutation,
    useUnsetPrivatePhotoMutation,
    useDeleteProfilePhotoMutation,
    ApiError,
} from "@app/core/services";
import { enqueueSnackbar } from "notistack";
import { PRIVY_API_ROOT } from "@app/config";

type ActionHandler<T, U> = {
    handler: (queryArg: U, onSuccessCallback?: () => void) => Promise<T | void>;
    isLoading: boolean;
};

type ActionHandlerWithoutArg<T = void> = {
    handler: (onSuccessCallback?: () => void) => Promise<T | void>;
    isLoading: boolean;
};

type MutationHookResult<T, U> = { mutateAsync: (arg: U) => Promise<T>; isPending: boolean };
type MutationHookResultWithoutArg<T> = { mutateAsync: () => Promise<T>; isPending: boolean };

export interface UseProfilActions {
    setPublic: ActionHandler<Photo, string>;
    setPrivate: ActionHandler<Photo, string>;
    unsetPublic: ActionHandlerWithoutArg;
    unsetPrivate: ActionHandlerWithoutArg;
    delete: ActionHandler<void, string>;
    downloadPhoto: (photo: Photo) => void;
}

export const useProfileActions = (): UseProfilActions => {
    const deletePhotoMutation = useDeleteProfilePhotoMutation();
    const setPublicMutation = useSetPublicPhotoMutation();
    const setPrivateMutation = useSetPrivatePhotoMutation();
    const unsetPublicMutation = useUnsetPublicPhotoMutation();
    const unsetPrivateMutation = useUnsetPrivatePhotoMutation();

    const handleAction = async <T>(action: () => Promise<T>, onSuccess?: () => void): Promise<T | void> => {
        try {
            const result: Awaited<T> = await action();
            onSuccess?.();
            return result;
        } catch (error) {
            const errorMessage: string = (error as ApiError)?.message;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    const buildAction = <T, U>(mutation: MutationHookResult<T, U>): ActionHandler<T, U> => ({
        handler: (queryArg, onSuccessCallback) => handleAction(() => mutation.mutateAsync(queryArg), onSuccessCallback),
        isLoading: mutation.isPending,
    });

    const buildActionWithoutArg = <T>(mutation: MutationHookResultWithoutArg<T>): ActionHandlerWithoutArg<T> => ({
        handler: onSuccessCallback => handleAction(() => mutation.mutateAsync(), onSuccessCallback),
        isLoading: mutation.isPending,
    });

    const downloadPhoto = (photo: Photo): void => {
        window.open(`${PRIVY_API_ROOT}/v1/profile/photos/${photo.id}/download`, "_self");
    };

    return {
        downloadPhoto,
        delete: buildAction(deletePhotoMutation),
        setPublic: buildAction(setPublicMutation),
        setPrivate: buildAction(setPrivateMutation),
        unsetPublic: buildActionWithoutArg(unsetPublicMutation),
        unsetPrivate: buildActionWithoutArg(unsetPrivateMutation),
    };
};
