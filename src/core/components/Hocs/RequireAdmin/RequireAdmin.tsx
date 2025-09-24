import { FC } from "react";
import { UserContext } from "@app/features";
import { UserRole } from "@app/core/services";
import { Navigate, Outlet, useRouteLoaderData } from "react-router-dom";
import { PROFILE_PAGE_PATH, ROOT_ID } from "@app/core/constants/pathConstants";

export const RequireAdmin: FC = () => {
    const { user } = useRouteLoaderData(ROOT_ID) as UserContext;
    if (user?.role !== UserRole.ADMIN) {
        return <Navigate to={PROFILE_PAGE_PATH} replace />;
    }
    return <Outlet />;
};
