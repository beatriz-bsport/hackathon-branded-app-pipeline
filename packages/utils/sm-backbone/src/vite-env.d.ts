/// <reference types="vite/client" />

type StudioRuntimeEnv = "local" | "dev" | "staging" | "production";

interface Window {
  __SM_RUNTIME__?: Record<string, string>;
  __SM_RUNTIME_PRESETS__?: Record<StudioRuntimeEnv, Record<string, string>>;
}
