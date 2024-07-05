/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly DEV_BASE_PATH: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}