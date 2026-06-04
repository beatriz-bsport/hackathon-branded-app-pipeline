import { beforeEach, describe, expect, it, vi } from "vitest";

const RUNTIME_ENV_STORAGE_KEY = "@bsport/studio-runtime-env";
const RUNTIME_FIELD_ENV_MAP_STORAGE_KEY =
  "@bsport/studio-runtime-field-env-map";
const RUNTIME_API_ENVIRONMENT_NAME_STORAGE_KEY =
  "@bsport/studio-runtime-api-environment-name";
const RUNTIME_API_ENVIRONMENT_OVERRIDE_STORAGE_KEY =
  "@bsport/studio-runtime-api-environment-override";

const loadRuntimeConfig = async (env: string) => {
  vi.resetModules();
  vi.doMock("@bsport/envs", () => ({
    getEnv: () => env,
  }));

  return import("#src/runtime/runtime-config");
};

const setRuntimePayload = (runtimePayload: Record<string, string>) => {
  window.__SM_RUNTIME__ = runtimePayload;
  window.__SM_RUNTIME_PRESETS__ = undefined;
};

describe("runtimeConfig", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.doUnmock("@bsport/envs");
    window.localStorage.clear();
    window.__SM_RUNTIME__ = undefined;
    window.__SM_RUNTIME_PRESETS__ = undefined;
  });

  it("applies the stored local runtime preset on startup", async () => {
    setRuntimePayload({
      API_BASE_URL: "https://api.dev.bsport.io",
      SENTRY_DSN: "dev-sentry",
      UNLEASH_ENVIRONMENT: "dev",
    });
    window.localStorage.setItem(RUNTIME_ENV_STORAGE_KEY, "local");

    const { initializeStudioRuntimeFromStorage } =
      await loadRuntimeConfig("local");

    expect(initializeStudioRuntimeFromStorage()).toEqual({
      API_BASE_URL: "http://localhost:8000",
      SENTRY_DSN: "dev-sentry",
      UNLEASH_ENVIRONMENT: "dev",
    });
    expect(window.__SM_RUNTIME__).toEqual({
      API_BASE_URL: "http://localhost:8000",
      SENTRY_DSN: "dev-sentry",
      UNLEASH_ENVIRONMENT: "dev",
    });
  });

  it("applies the stored custom API environment on startup", async () => {
    setRuntimePayload({
      API_BASE_URL: "https://api.dev.bsport.io",
      SENTRY_DSN: "dev-sentry",
    });
    window.localStorage.setItem(
      RUNTIME_API_ENVIRONMENT_OVERRIDE_STORAGE_KEY,
      "true",
    );
    window.localStorage.setItem(
      RUNTIME_API_ENVIRONMENT_NAME_STORAGE_KEY,
      "qa-preview-12",
    );

    const { initializeStudioRuntimeFromStorage } =
      await loadRuntimeConfig("local");

    expect(initializeStudioRuntimeFromStorage()).toEqual({
      API_BASE_URL: "https://qa-preview-12.api.chaos.bsport.io",
      SENTRY_DSN: "dev-sentry",
    });
  });

  it("falls back safely when persisted runtime values are invalid", async () => {
    setRuntimePayload({
      API_BASE_URL: "https://api.dev.bsport.io",
      SENTRY_DSN: "dev-sentry",
    });
    window.localStorage.setItem(RUNTIME_ENV_STORAGE_KEY, "qa");
    window.localStorage.setItem(
      RUNTIME_FIELD_ENV_MAP_STORAGE_KEY,
      JSON.stringify({
        API_BASE_URL: "qa",
        UNKNOWN_KEY: "local",
      }),
    );

    const { initializeStudioRuntimeFromStorage } =
      await loadRuntimeConfig("local");

    expect(initializeStudioRuntimeFromStorage()).toEqual({
      API_BASE_URL: "https://api.dev.bsport.io",
      SENTRY_DSN: "dev-sentry",
    });
    expect(window.__SM_RUNTIME__).toEqual({
      API_BASE_URL: "https://api.dev.bsport.io",
      SENTRY_DSN: "dev-sentry",
    });
  });

  it("does not mutate runtime when there are no stored runtime settings", async () => {
    window.__SM_RUNTIME__ = undefined;

    const { initializeStudioRuntimeFromStorage } =
      await loadRuntimeConfig("local");

    expect(initializeStudioRuntimeFromStorage()).toEqual({});
    expect(window.__SM_RUNTIME__).toBeUndefined();
  });

  it("does not apply stored overrides in production", async () => {
    const productionRuntimePayload = {
      API_BASE_URL: "https://api.production.bsport.io",
      SENTRY_DSN: "production-sentry",
    };
    setRuntimePayload(productionRuntimePayload);
    window.localStorage.setItem(RUNTIME_ENV_STORAGE_KEY, "local");

    const { initializeStudioRuntimeFromStorage } =
      await loadRuntimeConfig("production");

    expect(initializeStudioRuntimeFromStorage()).toEqual(
      productionRuntimePayload,
    );
    expect(window.__SM_RUNTIME__).toEqual(productionRuntimePayload);
  });
});
