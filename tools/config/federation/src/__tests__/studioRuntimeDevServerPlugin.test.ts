import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "fs";
import type { IncomingMessage, ServerResponse } from "http";
import { tmpdir } from "os";
import { join } from "path";
import type { Connect, ViteDevServer } from "vite";
import { afterEach, describe, expect, it, vi } from "vitest";
import { runInNewContext } from "vm";

import { studioRuntimeDevServerPlugin } from "../studioRuntimeDevServerPlugin.js";

type Middleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: Connect.NextFunction,
) => void;

const RUNTIME_ENV_STORAGE_KEY = "@bsport/studio-runtime-env";
const RUNTIME_FIELD_ENV_MAP_STORAGE_KEY =
  "@bsport/studio-runtime-field-env-map";
const RUNTIME_API_ENVIRONMENT_NAME_STORAGE_KEY =
  "@bsport/studio-runtime-api-environment-name";
const RUNTIME_API_ENVIRONMENT_OVERRIDE_STORAGE_KEY =
  "@bsport/studio-runtime-api-environment-override";

const tempDirs: string[] = [];

const createTempRootDir = () => {
  const rootDir = mkdtempSync(join(tmpdir(), "studio-runtime-dev-server-"));
  tempDirs.push(rootDir);
  return rootDir;
};

const createRuntimeFile = ({
  rootDir,
  envName,
  runtimePayload,
}: {
  rootDir: string;
  envName: string;
  runtimePayload: Record<string, string>;
}) => {
  const envDir = join(rootDir, "envs");
  mkdirSync(envDir, { recursive: true });
  writeFileSync(
    join(envDir, `${envName}.studio-env.js`),
    `window.__SM_RUNTIME__ = ${JSON.stringify(runtimePayload, null, 2)};\n`,
  );
};

const registerPluginMiddleware = (rootDir: string) => {
  const middlewares: Middleware[] = [];
  const plugin = studioRuntimeDevServerPlugin({
    rootDir,
  });

  const server = {
    middlewares: {
      use: (middleware: Middleware) => {
        middlewares.push(middleware);
      },
    },
  } as unknown as ViteDevServer;

  plugin.configureServer?.(server);
  const middleware = middlewares[0];

  if (!middleware) {
    throw new Error("Expected studio runtime middleware to be registered");
  }

  return middleware;
};

const executeMiddleware = ({
  requestUrl,
  rootDir,
}: {
  requestUrl: string;
  rootDir: string;
}) => {
  const middleware = registerPluginMiddleware(rootDir);
  const next = vi.fn<Connect.NextFunction>();
  let body = "";
  const contentType = {
    value: undefined as string | undefined,
  };

  const response = {
    statusCode: 0,
    setHeader: vi.fn((name: string, value: string) => {
      if (name.toLowerCase() === "content-type") {
        contentType.value = value;
      }
    }),
    end: vi.fn((chunk?: string) => {
      body = chunk ?? "";
    }),
  } as unknown as ServerResponse;

  middleware(
    { method: "GET", url: requestUrl } as IncomingMessage,
    response,
    next,
  );

  return {
    next,
    response,
    body,
    contentType: contentType.value,
  };
};

const evaluateRuntimeScript = ({
  script,
  storage,
}: {
  script: string;
  storage?: Record<string, string>;
}) => {
  const storageState = {
    ...(storage ?? {}),
  };

  const sandbox = {
    window: {
      __SM_RUNTIME__: undefined as undefined | Record<string, string>,
      localStorage: {
        getItem(key: string) {
          return Object.prototype.hasOwnProperty.call(storageState, key)
            ? storageState[key]
            : null;
        },
        setItem(key: string, value: string) {
          storageState[key] = value;
        },
        removeItem(key: string) {
          delete storageState[key];
        },
      },
    },
  };

  runInNewContext(script, sandbox, {
    timeout: 100,
  });

  return sandbox.window.__SM_RUNTIME__;
};

afterEach(() => {
  tempDirs.splice(0).forEach((dirPath) => {
    rmSync(dirPath, {
      recursive: true,
      force: true,
    });
  });
});

describe("studioRuntimeDevServerPlugin", () => {
  it("serves dev runtime payload by default", () => {
    const rootDir = createTempRootDir();
    createRuntimeFile({
      rootDir,
      envName: "dev",
      runtimePayload: {
        API_BASE_URL: "https://api.dev.bsport.io",
        SENTRY_DSN: "dev-sentry",
      },
    });
    createRuntimeFile({
      rootDir,
      envName: "staging",
      runtimePayload: {
        API_BASE_URL: "https://api.staging.bsport.io",
        SENTRY_DSN: "staging-sentry",
      },
    });

    const result = executeMiddleware({
      requestUrl: "/studio/studio-env.js",
      rootDir,
    });

    const runtimePayload = evaluateRuntimeScript({
      script: result.body,
    });

    expect(result.next).not.toHaveBeenCalled();
    expect(result.response.statusCode).toBe(200);
    expect(result.contentType).toBe("application/javascript; charset=utf-8");
    expect(runtimePayload).toEqual({
      API_BASE_URL: "https://api.dev.bsport.io",
      SENTRY_DSN: "dev-sentry",
    });
  });

  it("applies selected runtime preset from localStorage", () => {
    const rootDir = createTempRootDir();
    createRuntimeFile({
      rootDir,
      envName: "dev",
      runtimePayload: {
        API_BASE_URL: "https://api.dev.bsport.io",
        SENTRY_DSN: "dev-sentry",
      },
    });
    createRuntimeFile({
      rootDir,
      envName: "staging",
      runtimePayload: {
        API_BASE_URL: "https://api.staging.bsport.io",
        SENTRY_DSN: "staging-sentry",
      },
    });

    const result = executeMiddleware({
      requestUrl: "/studio/studio-env.js",
      rootDir,
    });

    const runtimePayload = evaluateRuntimeScript({
      script: result.body,
      storage: {
        [RUNTIME_ENV_STORAGE_KEY]: "staging",
      },
    });

    expect(runtimePayload).toEqual({
      API_BASE_URL: "https://api.staging.bsport.io",
      SENTRY_DSN: "staging-sentry",
    });
  });

  it("applies per-field runtime preset on top of selected preset", () => {
    const rootDir = createTempRootDir();
    createRuntimeFile({
      rootDir,
      envName: "dev",
      runtimePayload: {
        API_BASE_URL: "https://api.dev.bsport.io",
        SENTRY_DSN: "dev-sentry",
      },
    });
    createRuntimeFile({
      rootDir,
      envName: "local",
      runtimePayload: {
        API_BASE_URL: "http://localhost:8000",
      },
    });

    const result = executeMiddleware({
      requestUrl: "/studio/studio-env.js",
      rootDir,
    });

    const runtimePayload = evaluateRuntimeScript({
      script: result.body,
      storage: {
        [RUNTIME_FIELD_ENV_MAP_STORAGE_KEY]: JSON.stringify({
          API_BASE_URL: "local",
        }),
      },
    });

    expect(runtimePayload).toEqual({
      API_BASE_URL: "http://localhost:8000",
      SENTRY_DSN: "dev-sentry",
    });
  });

  it("ignores unknown runtime field env-map keys", () => {
    const rootDir = createTempRootDir();
    createRuntimeFile({
      rootDir,
      envName: "dev",
      runtimePayload: {
        API_BASE_URL: "https://api.dev.bsport.io",
      },
    });
    createRuntimeFile({
      rootDir,
      envName: "local",
      runtimePayload: {
        API_BASE_URL: "http://localhost:8000",
      },
    });

    const result = executeMiddleware({
      requestUrl: "/studio/studio-env.js",
      rootDir,
    });

    const runtimePayload = evaluateRuntimeScript({
      script: result.body,
      storage: {
        [RUNTIME_FIELD_ENV_MAP_STORAGE_KEY]: JSON.stringify({
          API_BASE_URL: "local",
          UNKNOWN_KEY: "staging",
        }),
      },
    });

    expect(runtimePayload).toEqual({
      API_BASE_URL: "http://localhost:8000",
    });
    expect(runtimePayload?.UNKNOWN_KEY).toBeUndefined();
  });

  it("applies custom API environment override when enabled", () => {
    const rootDir = createTempRootDir();
    createRuntimeFile({
      rootDir,
      envName: "dev",
      runtimePayload: {
        API_BASE_URL: "https://api.dev.bsport.io",
        SENTRY_DSN: "dev-sentry",
      },
    });

    const result = executeMiddleware({
      requestUrl: "/studio/studio-env.js",
      rootDir,
    });

    const runtimePayload = evaluateRuntimeScript({
      script: result.body,
      storage: {
        [RUNTIME_API_ENVIRONMENT_OVERRIDE_STORAGE_KEY]: "true",
        [RUNTIME_API_ENVIRONMENT_NAME_STORAGE_KEY]: "qa-preview-12",
      },
    });

    expect(runtimePayload).toEqual({
      API_BASE_URL: "https://qa-preview-12.api.chaos.bsport.io",
      SENTRY_DSN: "dev-sentry",
    });
  });

  it("falls back to dev API custom environment when override name is empty", () => {
    const rootDir = createTempRootDir();
    createRuntimeFile({
      rootDir,
      envName: "dev",
      runtimePayload: {
        API_BASE_URL: "https://api.dev.bsport.io",
      },
    });

    const result = executeMiddleware({
      requestUrl: "/studio/studio-env.js",
      rootDir,
    });

    const runtimePayload = evaluateRuntimeScript({
      script: result.body,
      storage: {
        [RUNTIME_API_ENVIRONMENT_OVERRIDE_STORAGE_KEY]: "true",
        [RUNTIME_API_ENVIRONMENT_NAME_STORAGE_KEY]: "   ",
      },
    });

    expect(runtimePayload).toEqual({
      API_BASE_URL: "https://dev.api.chaos.bsport.io",
    });
  });

  it("falls back to dev runtime when selected preset is invalid", () => {
    const rootDir = createTempRootDir();
    createRuntimeFile({
      rootDir,
      envName: "dev",
      runtimePayload: {
        API_BASE_URL: "https://api.dev.bsport.io",
      },
    });

    const result = executeMiddleware({
      requestUrl: "/studio/studio-env.js",
      rootDir,
    });

    const runtimePayload = evaluateRuntimeScript({
      script: result.body,
      storage: {
        [RUNTIME_ENV_STORAGE_KEY]: "qa",
      },
    });

    expect(runtimePayload).toEqual({
      API_BASE_URL: "https://api.dev.bsport.io",
    });
  });

  it("does not intercept unrelated routes", () => {
    const rootDir = createTempRootDir();

    const result = executeMiddleware({
      requestUrl: "/favicon.ico",
      rootDir,
    });

    expect(result.next).toHaveBeenCalledOnce();
    expect(result.response.statusCode).toBe(0);
    expect(result.body).toBe("");
  });
});
