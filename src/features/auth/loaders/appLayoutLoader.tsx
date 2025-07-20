import { store } from "@app/core/store";
import { redirect } from "react-router-dom";
import { authApi, User } from "@app/core/services";
import { SIGN_IN_PAGE_PATH } from "@app/core/constants/pathConstants";

export const appLayoutLoader = async (): Promise<{ user: User } | Response> => {
    // Check if the user is already in the cache
    const results = authApi.endpoints.me.select()(store.getState());

    if (results.isSuccess) return { user: results.data };

    const promise = store.dispatch(authApi.endpoints.me.initiate());
    try {
        const user: User = await promise.unwrap();
        return { user };
    } catch (error) {
        return redirect(SIGN_IN_PAGE_PATH);
    } finally {
        promise.unsubscribe();
    }
};
