/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

interface ImportMetaEnv {
  readonly VITE_I18N_NAMESPACE_PREFIX: string;
  readonly VITE_APPLICATION_BASE_URL: string;
  readonly BASENAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
