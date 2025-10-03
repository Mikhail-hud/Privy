import {
    Photo,
    useSetPublicPhotoMutation,
    useSetPrivatePhotoMutation,
    useUnsetPublicPhotoMutation,
    useUnsetPrivatePhotoMutation,
    useDeleteProfilePhotoMutation,
} from "@app/core/services";
import { enqueueSnackbar } from "notistack";
import { QueryError } from "@app/core/interfaces";
import { GENERIC_ERROR_MESSAGE } from "@app/core/constants/general";
import { PRIVY_API_ROOT } from "@app/config";

type ActionHandler<T, U> = {
    handler: (queryArg: U, onSuccessCallback?: () => void) => Promise<T | void>;
    isLoading: boolean;
};

type ActionHandlerWithoutArg<T = void> = {
    handler: (onSuccessCallback?: () => void) => Promise<T | void>;
    isLoading: boolean;
};

type MutationHookResult<T, U> = readonly [(arg: U) => { unwrap: () => Promise<T> }, { isLoading: boolean }];
type MutationHookResultWithoutArg<T> = readonly [() => { unwrap: () => Promise<T> }, { isLoading: boolean }];

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

    const handleAction = async <T>(
        action: () => { unwrap: () => Promise<T> },
        onSuccess?: () => void
    ): Promise<T | void> => {
        try {
            const result: Awaited<T> = await action().unwrap();
            onSuccess?.();
            return result;
        } catch (error) {
            const errorMessage: string = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    const buildAction = <T, U>([mutation, { isLoading }]: MutationHookResult<T, U>): ActionHandler<T, U> => ({
        handler: (queryArg, onSuccessCallback) => handleAction(() => mutation(queryArg), onSuccessCallback),
        isLoading,
    });

    const buildActionWithoutArg = <T>([
        mutation,
        { isLoading },
    ]: MutationHookResultWithoutArg<T>): ActionHandlerWithoutArg<T> => ({
        handler: onSuccessCallback => handleAction(() => mutation(), onSuccessCallback),
        isLoading,
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
