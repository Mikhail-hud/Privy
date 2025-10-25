import { FC, Suspense } from "react";
import {
    ROOT_ID,
    ROOT_PATH,
    SIGN_UP_PAGE_PATH,
    SIGN_IN_PAGE_PATH,
    PROFILE_PAGE_PATH,
    DIALOGS_PAGE_PATH,
    SETTINGS_PAGE_PATH,
    FAVORITES_PAGE_PATH,
    NOT_FOUND_PAGE_PATH,
    DASHBOARD_PAGE_PATH,
    RESET_PASSWORD_PATH,
    PROFILE_REPLIES_TAB_PATH,
    PROFILE_PHOTOS_TAB_PATH,
    PROFILE_REVEALS_TAB_PATH,
    SIGN_OUT_ACTION_ONLY_PATH,
    PROFILE_FAVORITES_TAB_PATH,
    LOOKUP_PAGE_PATH,
    USER_PROFILE_PAGE_PATH,
} from "@app/core/constants/pathConstants";
import { AppLayout, RedirectIfOwner, Spiner, TabContainer } from "@app/core/components";
import { createBrowserRouter, RouterProvider, Navigate, redirect } from "react-router-dom";
import {
    SignIn,
    NotFound,
    Profile,
    Dialogs,
    SignUp,
    Lookup,
    Favorites,
    ErrorPage,
    lookupLoader,
    ResetPassword,
    signInAction,
    signOutAction,
    appLayoutLoader,
    signUpAction,
    publicRoutesLoader,
    UserProfile,
    userProfileLoader,
} from "@app/features";
import { ProfilePhotos, profilePhotosLoader } from "@app/features/profile/ProfileCard/ProfileTabs";

// Lazy-loaded components to optimize initial load time
const RequireAdmin = lazy(() => import("@app/core/components/Hocs").then(module => ({ default: module.RequireAdmin })));
const Dashboard = lazy(() => import("@app/features/dashboard").then(module => ({ default: module.Dashboard })));
const Settings = lazy(() => import("@app/features/settings").then(module => ({ default: module.Settings })));

const router = createBrowserRouter([
    {
        path: SIGN_IN_PAGE_PATH,
        action: signInAction,
        element: <SignIn />,
        loader: publicRoutesLoader,
    },
    {
        path: SIGN_UP_PAGE_PATH,
        action: signUpAction,
        element: <SignUp />,
        loader: publicRoutesLoader,
    },
    {
        path: RESET_PASSWORD_PATH,
        element: <ResetPassword />,
        loader: publicRoutesLoader,
    },
    {
        // Action-only route, no element
        path: SIGN_OUT_ACTION_ONLY_PATH,
        action: signOutAction,
        loader: () => redirect(PROFILE_PAGE_PATH),
    },
    {
        id: ROOT_ID,
        path: ROOT_PATH,
        element: <AppLayout />,
        loader: appLayoutLoader,
        // Fallback UI if the loader throws an error
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Navigate to={PROFILE_PAGE_PATH} replace />,
            },
            {
                element: <RedirectIfOwner />,
                children: [
                    {
                        path: USER_PROFILE_PAGE_PATH,
                        loader: userProfileLoader,
                        element: <UserProfile />,
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
                        loader: profilePhotosLoader,
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
                loader: lookupLoader,
                path: LOOKUP_PAGE_PATH,
                element: <Lookup />,
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
                element: <RequireAdmin />,
                children: [
                    {
                        path: DASHBOARD_PAGE_PATH,
                        element: (
                            <Suspense fallback={<Spiner />}>
                                <Dashboard />
                            </Suspense>
                        ),
                    },
                ],
            },
            {
                path: SETTINGS_PAGE_PATH,
                element: (
                    <Suspense fallback={<Spiner />}>
                        <Settings />
                    </Suspense>
                ),
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
