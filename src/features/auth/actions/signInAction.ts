import { store } from "@app/core/store";
import { redirect } from "react-router-dom";
import { authApi, SignInPayload } from "@app/core/services";
import { PROFILE_PAGE_PATH } from "@app/core/constants/pathConstants";

interface ActionError {
    error: string;
}

export const signInAction = async ({ request }: { request: Request }): Promise<Response | ActionError> => {
    const formData: FormData = await request.formData();
    const credentials = Object.fromEntries(formData);
    const promise = store.dispatch(authApi.endpoints.signIn.initiate(credentials as unknown as SignInPayload));
    try {
        await promise.unwrap();
        return redirect(PROFILE_PAGE_PATH);
    } catch (error) {
        const errorMessage = error?.data?.message?.toString() || "Something went wrong. Please try again later.";
        return { error: errorMessage };
    }
};
