// src/vite-env.d.ts

/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PRIVY_API_ROOT: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
