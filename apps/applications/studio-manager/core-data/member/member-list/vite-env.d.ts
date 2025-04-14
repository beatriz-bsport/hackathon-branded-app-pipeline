/// <reference types="vite/client" />

interface ImportMetaEnv {
  // All environment variables should be defined here to provite type checking
  readonly VITE_I18N_NAMESPACE_PREFIX: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
