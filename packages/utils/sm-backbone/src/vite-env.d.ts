/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_UNLEASH_PROXY_URL?: string;
  readonly VITE_UNLEASH_CLIENT_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
