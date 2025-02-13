/// <reference types="vite/client" />

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ImportMetaEnv {
  // All environment variables should be defined here to provide type checking
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
