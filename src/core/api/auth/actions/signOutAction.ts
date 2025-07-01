import { authAPI } from "@app/core/api";
import { redirect } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { SIGN_IN_PAGE_PATH } from "@app/core/constants/pathConstants";

export const signOutAction = async () => {
    try {
        await authAPI.signOut();
    } catch (error) {
        const errorMessage = error?.response?.data?.message || "Something went wrong. Please try again later.";
        enqueueSnackbar(errorMessage, { variant: "error" });
        return null;
    }
    return redirect(SIGN_IN_PAGE_PATH);
};
