/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />
/// <reference types="@bsport/config-federation/vite" />

declare const __NAVIGATION_SIDEBAR__: FederationVariables;

declare const __API_ENV__: string;

interface ImportMetaEnv {
  readonly VITE_RELEASE_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
