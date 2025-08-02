import React from "react";
import { App } from "@app/core/app";
import { AppProviders } from "@app/core/providers";
import { createRoot, Root } from "react-dom/client";

const container: HTMLElement | null = document.getElementById("app");
const root: Root = createRoot(container!);

root.render(
    <React.StrictMode>
        <AppProviders>
            <App />
        </AppProviders>
    </React.StrictMode>
);
