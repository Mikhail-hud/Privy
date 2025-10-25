import { FC } from "react";
import { UserContext } from "@app/features";
import { Navigate, Outlet, useParams, useRouteLoaderData } from "react-router-dom";
import { LOOKUP_PAGE_PATH, PROFILE_PAGE_PATH, ROOT_ID, USER_HANDLE_PREFIX } from "@app/core/constants/pathConstants";

export const RedirectIfOwner: FC = () => {
    const rootData = useRouteLoaderData(ROOT_ID) as UserContext | undefined;
    const currentUser = rootData?.user;
    const { userName } = useParams();

    if (!userName || !userName.startsWith(USER_HANDLE_PREFIX)) {
        return <Navigate to={LOOKUP_PAGE_PATH} replace />;
    }
    const planedUserName: string = userName.replace(new RegExp(`^${USER_HANDLE_PREFIX}`), "");

    if (currentUser?.userName === planedUserName) {
        return <Navigate to={PROFILE_PAGE_PATH} replace />;
    }

    return <Outlet />;
};
