import { store } from "@app/core/store";
import { redirect } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { authApi } from "@app/core/services";
import { GENERIC_ERROR_MESSAGE } from "@app/core/constants/general";
import { SIGN_IN_PAGE_PATH } from "@app/core/constants/pathConstants";

export const signOutAction = async (): Promise<Response> => {
    const promise = store.dispatch(authApi.endpoints.signOut.initiate());
    try {
        await promise.unwrap();
        return redirect(SIGN_IN_PAGE_PATH);
    } catch (error) {
        const errorMessage = error?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
        enqueueSnackbar(errorMessage, { variant: "error" });
        return null;
    }
};
