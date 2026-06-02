/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE?: string;
  readonly VITE_STORYBOOK_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.mdx" {
  import type { MDXProps } from "mdx/types";
  const component: React.ComponentType<MDXProps>;
  export default component;
}
