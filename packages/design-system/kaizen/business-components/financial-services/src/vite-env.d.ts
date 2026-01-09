/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_I18N_NAMESPACE_PREFIX: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
