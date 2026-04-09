import { existsSync, readFileSync } from "fs";
import type { IncomingMessage, ServerResponse } from "http";
import { resolve } from "path";
import type { Connect, Plugin } from "vite";
import { runInNewContext } from "vm";

const RUNTIME_FILE_PATH = "/studio/studio-env.js";
const RUNTIME_CONTENT_TYPE = "application/javascript; charset=utf-8";
const RUNTIME_ENV_LOCAL_STORAGE_KEY = "@bsport/studio-runtime-env";
const RUNTIME_FIELD_ENV_MAP_LOCAL_STORAGE_KEY =
  "@bsport/studio-runtime-field-env-map";
const RUNTIME_API_ENVIRONMENT_NAME_LOCAL_STORAGE_KEY =
  "@bsport/studio-runtime-api-environment-name";
const RUNTIME_API_ENVIRONMENT_OVERRIDE_LOCAL_STORAGE_KEY =
  "@bsport/studio-runtime-api-environment-override";
const RUNTIME_API_BASE_URL_KEY = "API_BASE_URL";
const DEFAULT_RUNTIME_ENV = "dev";
const SUPPORTED_RUNTIME_ENVS = [
  "local",
  "dev",
  "staging",
  "production",
] as const;

type SupportedRuntimeEnv = (typeof SUPPORTED_RUNTIME_ENVS)[number];
type StudioRuntimePayload = Record<string, string>;

const shouldHandleRuntimeRequest = (url?: string) => {
  if (!url) {
    return false;
  }

  const [pathname] = url.split("?");
  return pathname === RUNTIME_FILE_PATH;
};

const getRuntimeEnvDirectoryCandidates = (rootDir: string) => {
  return [
    resolve(rootDir, "envs"),
    resolve(rootDir, "../host/envs"),
    resolve(rootDir, "../../host/envs"),
    resolve(process.cwd(), "apps/applications/studio-manager/host/envs"),
  ];
};

const parseRuntimePayloadFile = ({
  filePath,
}: {
  filePath: string;
}): StudioRuntimePayload | null => {
  try {
    const runtimeSource = readFileSync(filePath, "utf-8");
    const sandbox = {
      window: {
        __SM_RUNTIME__: undefined as unknown,
      },
    };

    runInNewContext(runtimeSource, sandbox, {
      timeout: 100,
    });

    const parsedRuntime = sandbox.window.__SM_RUNTIME__;
    if (
      !parsedRuntime ||
      typeof parsedRuntime !== "object" ||
      Array.isArray(parsedRuntime)
    ) {
      return null;
    }

    return Object.entries(parsedRuntime).reduce<StudioRuntimePayload>(
      (accumulator, [key, value]) => {
        if (typeof value === "string") {
          accumulator[key] = value;
        }

        return accumulator;
      },
      {},
    );
  } catch (error) {
    console.warn(
      `[studio-runtime-dev-server] Failed to parse runtime payload at ${filePath}.`,
      error,
    );
    return null;
  }
};

const loadRuntimePayloadForEnv = ({
  env,
  envDirectories,
}: {
  env: SupportedRuntimeEnv;
  envDirectories: string[];
}): StudioRuntimePayload | null => {
  const runtimeFilename = `${env}.studio-env.js`;

  for (const envDirectory of envDirectories) {
    const runtimeFilePath = resolve(envDirectory, runtimeFilename);
    if (!existsSync(runtimeFilePath)) {
      continue;
    }

    const runtimePayload = parseRuntimePayloadFile({
      filePath: runtimeFilePath,
    });

    if (runtimePayload) {
      return runtimePayload;
    }
  }

  return null;
};

const loadRuntimePayloadPresets = (
  rootDir: string,
): Record<SupportedRuntimeEnv, StudioRuntimePayload> => {
  const envDirectories = getRuntimeEnvDirectoryCandidates(rootDir);
  const devRuntimePayload = (() => {
    const runtimePayload = loadRuntimePayloadForEnv({
      env: DEFAULT_RUNTIME_ENV,
      envDirectories,
    });

    if (runtimePayload) {
      return runtimePayload;
    }

    for (const runtimeEnv of SUPPORTED_RUNTIME_ENVS) {
      const fallbackRuntimePayload = loadRuntimePayloadForEnv({
        env: runtimeEnv,
        envDirectories,
      });

      if (fallbackRuntimePayload) {
        console.warn(
          `[studio-runtime-dev-server] Missing '${DEFAULT_RUNTIME_ENV}.studio-env.js'. Falling back to '${runtimeEnv}.studio-env.js' as default runtime preset.`,
        );
        return fallbackRuntimePayload;
      }
    }

    throw new Error(
      "[studio-runtime-dev-server] Unable to load any committed studio runtime preset file.",
    );
  })();

  const presets = SUPPORTED_RUNTIME_ENVS.reduce<
    Record<SupportedRuntimeEnv, StudioRuntimePayload>
  >(
    (accumulator, env) => {
      const runtimePayload = loadRuntimePayloadForEnv({
        env,
        envDirectories,
      });

      accumulator[env] = runtimePayload ?? devRuntimePayload;
      return accumulator;
    },
    {} as Record<SupportedRuntimeEnv, StudioRuntimePayload>,
  );

  return presets;
};

const buildRuntimePayloadScript = (
  runtimePayloadPresets: Record<SupportedRuntimeEnv, StudioRuntimePayload>,
) => {
  const serializedPresets = JSON.stringify(runtimePayloadPresets);
  const serializedSupportedEnvs = JSON.stringify([...SUPPORTED_RUNTIME_ENVS]);

  return `(() => {
  const RUNTIME_ENV_STORAGE_KEY = ${JSON.stringify(RUNTIME_ENV_LOCAL_STORAGE_KEY)};
  const RUNTIME_FIELD_ENV_MAP_STORAGE_KEY = ${JSON.stringify(RUNTIME_FIELD_ENV_MAP_LOCAL_STORAGE_KEY)};
  const RUNTIME_API_ENVIRONMENT_NAME_STORAGE_KEY = ${JSON.stringify(
    RUNTIME_API_ENVIRONMENT_NAME_LOCAL_STORAGE_KEY,
  )};
  const RUNTIME_API_ENVIRONMENT_OVERRIDE_STORAGE_KEY = ${JSON.stringify(
    RUNTIME_API_ENVIRONMENT_OVERRIDE_LOCAL_STORAGE_KEY,
  )};
  const RUNTIME_API_BASE_URL_KEY = ${JSON.stringify(RUNTIME_API_BASE_URL_KEY)};
  const DEFAULT_RUNTIME_ENV = ${JSON.stringify(DEFAULT_RUNTIME_ENV)};
  const SUPPORTED_RUNTIME_ENVS = ${serializedSupportedEnvs};
  const RUNTIME_PRESETS = ${serializedPresets};

  const parseRuntimeEnv = (value) => {
    if (typeof value !== "string") {
      return null;
    }

    const normalizedValue = value.trim().toLowerCase();
    return SUPPORTED_RUNTIME_ENVS.includes(normalizedValue)
      ? normalizedValue
      : null;
  };

  const readSelectedRuntimeEnv = () => {
    try {
      const selectedRuntimeEnv = window.localStorage?.getItem(
        RUNTIME_ENV_STORAGE_KEY,
      );
      return parseRuntimeEnv(selectedRuntimeEnv) || DEFAULT_RUNTIME_ENV;
    } catch (_) {
      return DEFAULT_RUNTIME_ENV;
    }
  };

  const readRuntimeFieldEnvMap = () => {
    try {
      const rawFieldEnvMap = window.localStorage?.getItem(
        RUNTIME_FIELD_ENV_MAP_STORAGE_KEY,
      );
      if (typeof rawFieldEnvMap !== "string" || rawFieldEnvMap.trim() === "") {
        return {};
      }

      const parsedFieldEnvMap = JSON.parse(rawFieldEnvMap);
      if (
        !parsedFieldEnvMap ||
        typeof parsedFieldEnvMap !== "object" ||
        Array.isArray(parsedFieldEnvMap)
      ) {
        return {};
      }

      return Object.entries(parsedFieldEnvMap).reduce((accumulator, [key, value]) => {
        const parsedRuntimeEnv = parseRuntimeEnv(
          typeof value === "string" ? value : undefined,
        );
        if (parsedRuntimeEnv) {
          accumulator[key] = parsedRuntimeEnv;
        }
        return accumulator;
      }, {});
    } catch (_) {
      return {};
    }
  };

  const readApiEnvironmentOverride = () => {
    try {
      return (
        window.localStorage?.getItem(
          RUNTIME_API_ENVIRONMENT_OVERRIDE_STORAGE_KEY,
        ) === "true"
      );
    } catch (_) {
      return false;
    }
  };

  const readApiEnvironmentName = () => {
    try {
      const rawValue = window.localStorage?.getItem(
        RUNTIME_API_ENVIRONMENT_NAME_STORAGE_KEY,
      );
      if (typeof rawValue !== "string") {
        return DEFAULT_RUNTIME_ENV;
      }

      const normalizedValue = rawValue.trim().toLowerCase();
      return normalizedValue || DEFAULT_RUNTIME_ENV;
    } catch (_) {
      return DEFAULT_RUNTIME_ENV;
    }
  };

  const selectedRuntimeEnv = readSelectedRuntimeEnv();
  const runtimePayload =
    RUNTIME_PRESETS[selectedRuntimeEnv] || RUNTIME_PRESETS[DEFAULT_RUNTIME_ENV] || {};
  const runtimeFieldEnvMap = readRuntimeFieldEnvMap();

  const mergedRuntimePayload = { ...runtimePayload };
  Object.entries(runtimeFieldEnvMap).forEach(([key, runtimeEnv]) => {
    const runtimeValueFromPreset = RUNTIME_PRESETS[runtimeEnv]?.[key];
    if (typeof runtimeValueFromPreset === "string") {
      mergedRuntimePayload[key] = runtimeValueFromPreset;
    }
  });

  if (readApiEnvironmentOverride()) {
    const apiEnvironmentName = readApiEnvironmentName();
    mergedRuntimePayload[RUNTIME_API_BASE_URL_KEY] =
      \`https://\${apiEnvironmentName}.api.chaos.bsport.io\`;
  }

  window.__SM_RUNTIME_PRESETS__ = RUNTIME_PRESETS;
  window.__SM_RUNTIME__ = mergedRuntimePayload;
})();`;
};

export const studioRuntimeDevServerPlugin = ({
  rootDir = process.cwd(),
}: {
  rootDir?: string;
} = {}): Plugin => {
  return {
    name: "studio-runtime-dev-server",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(
        (
          req: IncomingMessage,
          res: ServerResponse,
          next: Connect.NextFunction,
        ) => {
          if (!shouldHandleRuntimeRequest(req.url)) {
            next();
            return;
          }

          res.statusCode = 200;
          res.setHeader("Content-Type", RUNTIME_CONTENT_TYPE);
          res.end(
            buildRuntimePayloadScript(loadRuntimePayloadPresets(rootDir)),
          );
        },
      );
    },
  };
};
