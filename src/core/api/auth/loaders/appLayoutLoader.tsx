import { authAPI } from "@app/core/api";
import { User } from "@app/core/services";
import { redirect } from "react-router-dom";
import { SIGN_IN_PAGE_PATH } from "@app/core/constants/pathConstants";

export const appLayoutLoader = async (): Promise<{ user: User } | Response> => {
    try {
        const user: User = await authAPI.me();
        if (!user) {
            return redirect(SIGN_IN_PAGE_PATH);
        }
        return { user };
    } catch (error) {
        return redirect(SIGN_IN_PAGE_PATH);
    }
};
