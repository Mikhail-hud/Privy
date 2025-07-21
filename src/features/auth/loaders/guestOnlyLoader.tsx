import { store } from "@app/core/store";
import { redirect } from "react-router-dom";
import { authApi } from "@app/core/services";
import { PROFILE_PAGE_PATH } from "@app/core/constants/pathConstants";

export const guestOnlyLoader = async (): Promise<Response> | null => {
    const promise = store.dispatch(authApi.endpoints.me.initiate());
    try {
        await promise.unwrap();
        return redirect(PROFILE_PAGE_PATH);
    } catch (error) {
        return null;
    } finally {
        promise.unsubscribe();
    }
};
