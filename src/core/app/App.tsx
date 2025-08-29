import { FC } from "react";
import {
    ROOT_ID,
    ROOT_PATH,
    SIGN_IN_PAGE_PATH,
    PROFILE_PAGE_PATH,
    DIALOGS_PAGE_PATH,
    SETTINGS_PAGE_PATH,
    FAVORITES_PAGE_PATH,
    NOT_FOUND_PAGE_PATH,
    DASHBOARD_PAGE_PATH,
    RESET_PASSWORD_PATH,
    SIGN_OUT_ACTION_ONLY_PATH,
    SIGN_UP_PAGE_PATH,
    PROFILE_FAVORITES_TAB_PATH,
    PROFILE_REPLIES_TAB_PATH,
    PROFILE_PHOTOS_TAB_PATH,
    PROFILE_REVEALS_TAB_PATH,
} from "@app/core/constants/pathConstants";
import { AppLayout, RequireAdmin, TabContainer } from "@app/core/components";
import { createBrowserRouter, RouterProvider, Navigate, redirect } from "react-router-dom";
import {
    SignIn,
    NotFound,
    Profile,
    Dialogs,
    SignUp,
    Settings,
    Favorites,
    Dashboard,
    ResetPassword,
    signInAction,
    signOutAction,
    appLayoutLoader,
    signUpAction,
} from "@app/features";
import { ProfilePhotos } from "@app/features/profile/ProfileCard/ProfileTabs";

const router = createBrowserRouter([
    {
        path: SIGN_IN_PAGE_PATH,
        action: signInAction,
        element: <SignIn />,
    },
    {
        path: SIGN_UP_PAGE_PATH,
        action: signUpAction,
        element: <SignUp />,
    },
    {
        path: RESET_PASSWORD_PATH,
        element: <ResetPassword />,
    },
    {
        // Action only route, no element
        path: SIGN_OUT_ACTION_ONLY_PATH,
        action: signOutAction,
        loader: () => redirect(PROFILE_PAGE_PATH),
    },
    {
        id: ROOT_ID,
        path: ROOT_PATH,
        element: <AppLayout />,
        loader: appLayoutLoader,
        children: [
            {
                index: true,
                element: <Navigate to={PROFILE_PAGE_PATH} replace />,
            },

            {
                element: <RequireAdmin />,
                children: [
                    {
                        path: DASHBOARD_PAGE_PATH,
                        element: <Dashboard />,
                    },
                ],
            },
            {
                path: PROFILE_PAGE_PATH,
                element: <Profile />,
                children: [
                    {
                        index: true,
                        handle: { tab: PROFILE_PAGE_PATH },
                        element: <TabContainer title="Threads" />,
                    },
                    {
                        path: PROFILE_FAVORITES_TAB_PATH,
                        element: <TabContainer title="Favorites" />,
                        handle: { tab: PROFILE_FAVORITES_TAB_PATH },
                    },
                    {
                        path: PROFILE_REPLIES_TAB_PATH,
                        element: <TabContainer title="Replies" />,
                        handle: { tab: PROFILE_REPLIES_TAB_PATH },
                    },
                    {
                        path: PROFILE_PHOTOS_TAB_PATH,
                        element: <ProfilePhotos />,
                        handle: { tab: PROFILE_PHOTOS_TAB_PATH },
                    },
                    {
                        path: PROFILE_REVEALS_TAB_PATH,
                        element: <TabContainer title="Reveals" />,
                        handle: { tab: PROFILE_REVEALS_TAB_PATH },
                    },
                ],
            },
            {
                path: DIALOGS_PAGE_PATH,
                element: <Dialogs />,
            },
            {
                path: FAVORITES_PAGE_PATH,
                element: <Favorites />,
            },
            {
                path: SETTINGS_PAGE_PATH,
                element: <Settings />,
            },
        ],
    },
    {
        path: NOT_FOUND_PAGE_PATH,
        element: <NotFound />,
    },
]);

export const App: FC = () => {
    return <RouterProvider router={router} />;
};
