import { store } from "@app/core/store";
import { redirect } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { QueryError } from "@app/core/interfaces";
import { authApi, SignUpPayload } from "@app/core/services";
import { GENERIC_ERROR_MESSAGE } from "@app/core/constants/general";
import { PROFILE_PAGE_PATH } from "@app/core/constants/pathConstants";

interface ActionError {
    error: string;
    errors?: Record<string, string>;
}

export const signUpAction = async ({ request }: { request: Request }): Promise<Response | ActionError> => {
    const formData: FormData = await request.formData();
    const credentials = Object.fromEntries(formData);
    const promise = store.dispatch(authApi.endpoints.signUp.initiate(credentials as unknown as SignUpPayload));
    try {
        await promise.unwrap();
        return redirect(PROFILE_PAGE_PATH);
    } catch (error) {
        const errorMessage = (error as QueryError)?.data?.message?.toString() || GENERIC_ERROR_MESSAGE;
        enqueueSnackbar(errorMessage, { variant: "error" });
        return { error: errorMessage, errors: (error as QueryError)?.data?.errors };
    }
};
