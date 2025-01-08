/// <reference types="vite/client" />

interface ImportMetaEnv {
  // All environment variables should be defined here to provite type checking
  VITE_ENV_EXAMPLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
