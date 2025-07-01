import { redirect } from "react-router-dom";
import { authAPI, SignInPayload } from "@app/core/api";
import { PROFILE_PAGE_PATH } from "@app/core/constants/pathConstants";

interface ActionError {
    error: string;
}

export const signInAction = async ({ request }: { request: Request }): Promise<Response | ActionError> => {
    const formData: FormData = await request.formData();
    const credentials = Object.fromEntries(formData);

    try {
        await authAPI.signIn(credentials as unknown as SignInPayload);
        return redirect(PROFILE_PAGE_PATH);
    } catch (error) {
        const errorMessage = error?.response?.data?.message || "Something went wrong. Please try again later.";
        return { error: errorMessage };
    }
};
