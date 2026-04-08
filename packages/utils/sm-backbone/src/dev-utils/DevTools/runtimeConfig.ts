export const STUDIO_RUNTIME_ENV_STORAGE_KEY = "@bsport/studio-runtime-env";
export const STUDIO_RUNTIME_FIELD_ENV_MAP_STORAGE_KEY =
  "@bsport/studio-runtime-field-env-map";
export const STUDIO_RUNTIME_API_ENVIRONMENT_NAME_STORAGE_KEY =
  "@bsport/studio-runtime-api-environment-name";
export const STUDIO_RUNTIME_API_ENVIRONMENT_OVERRIDE_STORAGE_KEY =
  "@bsport/studio-runtime-api-environment-override";
export const STUDIO_RUNTIME_UPDATED_EVENT = "@bsport/studio-runtime-updated";
export const STUDIO_RUNTIME_API_BASE_URL_KEY = "API_BASE_URL";

export const STUDIO_RUNTIME_ENVS = [
  "local",
  "dev",
  "staging",
  "production",
] as const;

export const DEFAULT_STUDIO_RUNTIME_ENV = "dev";

export type StudioRuntimeEnv = (typeof STUDIO_RUNTIME_ENVS)[number];
export type StudioRuntimePayload = Record<string, string>;
export type StudioRuntimePresets = Record<
  StudioRuntimeEnv,
  StudioRuntimePayload
>;
export type StudioRuntimeFieldEnvMap = Record<string, StudioRuntimeEnv>;

const normalizeStudioRuntimeApiEnvironmentName = (
  value: string | undefined | null,
): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim().toLowerCase();
  return normalizedValue || null;
};

export const buildStudioRuntimeApiBaseUrlFromEnvironmentName = (
  environmentName: string,
) => {
  return `https://${environmentName}.api.chaos.bsport.io`;
};

const sanitizeStudioRuntimePayload = (
  candidate: unknown,
): StudioRuntimePayload => {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    return {};
  }

  return Object.entries(
    candidate as Record<string, unknown>,
  ).reduce<StudioRuntimePayload>((accumulator, [key, value]) => {
    if (typeof value === "string") {
      accumulator[key] = value;
    }

    return accumulator;
  }, {});
};

const buildEmptyStudioRuntimePresets = (): StudioRuntimePresets => {
  return STUDIO_RUNTIME_ENVS.reduce<StudioRuntimePresets>(
    (accumulator, env) => {
      accumulator[env] = {};
      return accumulator;
    },
    {} as StudioRuntimePresets,
  );
};

export const parseStudioRuntimeEnv = (
  value: string | undefined | null,
): StudioRuntimeEnv | null => {
  if (!value) {
    return null;
  }

  const normalizedValue = value.trim().toLowerCase();
  return STUDIO_RUNTIME_ENVS.includes(normalizedValue as StudioRuntimeEnv)
    ? (normalizedValue as StudioRuntimeEnv)
    : null;
};

export const readStudioRuntimeEnv = (): StudioRuntimeEnv => {
  try {
    const rawValue = window.localStorage.getItem(
      STUDIO_RUNTIME_ENV_STORAGE_KEY,
    );
    return parseStudioRuntimeEnv(rawValue) ?? DEFAULT_STUDIO_RUNTIME_ENV;
  } catch (_) {
    return DEFAULT_STUDIO_RUNTIME_ENV;
  }
};

export const writeStudioRuntimeEnv = (runtimeEnv: StudioRuntimeEnv) => {
  try {
    window.localStorage.setItem(STUDIO_RUNTIME_ENV_STORAGE_KEY, runtimeEnv);
  } catch (_) {
    // noop
  }
};

export const readStudioRuntimeApiEnvironmentName = (): string => {
  try {
    const rawValue = window.localStorage.getItem(
      STUDIO_RUNTIME_API_ENVIRONMENT_NAME_STORAGE_KEY,
    );
    return (
      normalizeStudioRuntimeApiEnvironmentName(rawValue) ??
      DEFAULT_STUDIO_RUNTIME_ENV
    );
  } catch (_) {
    return DEFAULT_STUDIO_RUNTIME_ENV;
  }
};

export const writeStudioRuntimeApiEnvironmentName = (
  environmentName: string,
) => {
  try {
    const normalizedEnvironmentName =
      normalizeStudioRuntimeApiEnvironmentName(environmentName);
    if (!normalizedEnvironmentName) {
      window.localStorage.removeItem(
        STUDIO_RUNTIME_API_ENVIRONMENT_NAME_STORAGE_KEY,
      );
      return;
    }

    window.localStorage.setItem(
      STUDIO_RUNTIME_API_ENVIRONMENT_NAME_STORAGE_KEY,
      normalizedEnvironmentName,
    );
  } catch (_) {
    // noop
  }
};

export const readStudioRuntimeApiEnvironmentOverride = (): boolean => {
  try {
    return (
      window.localStorage.getItem(
        STUDIO_RUNTIME_API_ENVIRONMENT_OVERRIDE_STORAGE_KEY,
      ) === "true"
    );
  } catch (_) {
    return false;
  }
};

export const writeStudioRuntimeApiEnvironmentOverride = (
  isEnabled: boolean,
) => {
  try {
    if (!isEnabled) {
      window.localStorage.removeItem(
        STUDIO_RUNTIME_API_ENVIRONMENT_OVERRIDE_STORAGE_KEY,
      );
      return;
    }

    window.localStorage.setItem(
      STUDIO_RUNTIME_API_ENVIRONMENT_OVERRIDE_STORAGE_KEY,
      "true",
    );
  } catch (_) {
    // noop
  }
};

export const clearStudioRuntimeApiEnvironmentOverride = () => {
  try {
    window.localStorage.removeItem(
      STUDIO_RUNTIME_API_ENVIRONMENT_NAME_STORAGE_KEY,
    );
    window.localStorage.removeItem(
      STUDIO_RUNTIME_API_ENVIRONMENT_OVERRIDE_STORAGE_KEY,
    );
  } catch (_) {
    // noop
  }
};

export const getCurrentStudioRuntime = (): StudioRuntimePayload => {
  return sanitizeStudioRuntimePayload(window.__SM_RUNTIME__);
};

export const readStudioRuntimePresets = (): StudioRuntimePresets => {
  const studioRuntimePresets = buildEmptyStudioRuntimePresets();

  const runtimePresetsCandidate = window.__SM_RUNTIME_PRESETS__;
  if (
    runtimePresetsCandidate &&
    typeof runtimePresetsCandidate === "object" &&
    !Array.isArray(runtimePresetsCandidate)
  ) {
    STUDIO_RUNTIME_ENVS.forEach((runtimeEnv) => {
      studioRuntimePresets[runtimeEnv] = sanitizeStudioRuntimePayload(
        (runtimePresetsCandidate as Record<string, unknown>)[runtimeEnv],
      );
    });
  }

  if (
    Object.keys(studioRuntimePresets[DEFAULT_STUDIO_RUNTIME_ENV]).length === 0
  ) {
    studioRuntimePresets[DEFAULT_STUDIO_RUNTIME_ENV] =
      getCurrentStudioRuntime();
  }

  return studioRuntimePresets;
};

export const getStudioRuntimeVariableKeys = (): string[] => {
  const runtimePresets = readStudioRuntimePresets();
  const productionRuntimeKeys = Object.keys(runtimePresets.production);
  if (productionRuntimeKeys.length > 0) {
    return productionRuntimeKeys.sort();
  }

  const runtimeKeys = new Set<string>();
  STUDIO_RUNTIME_ENVS.forEach((runtimeEnv) => {
    Object.keys(runtimePresets[runtimeEnv]).forEach((runtimeKey) => {
      runtimeKeys.add(runtimeKey);
    });
  });

  if (runtimeKeys.size === 0) {
    Object.keys(getCurrentStudioRuntime()).forEach((runtimeKey) => {
      runtimeKeys.add(runtimeKey);
    });
  }

  return [...runtimeKeys].sort();
};

const sanitizeStudioRuntimeFieldEnvMap = ({
  candidate,
  allowedRuntimeKeys,
}: {
  candidate: unknown;
  allowedRuntimeKeys: string[];
}): StudioRuntimeFieldEnvMap => {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    return {};
  }

  const allowedRuntimeKeysSet = new Set(allowedRuntimeKeys);
  const entries = Object.entries(candidate as Record<string, unknown>);

  return entries.reduce<StudioRuntimeFieldEnvMap>(
    (accumulator, [runtimeKey, runtimeEnvValue]) => {
      if (!allowedRuntimeKeysSet.has(runtimeKey)) {
        return accumulator;
      }

      const parsedRuntimeEnv = parseStudioRuntimeEnv(
        typeof runtimeEnvValue === "string" ? runtimeEnvValue : undefined,
      );
      if (!parsedRuntimeEnv) {
        return accumulator;
      }

      accumulator[runtimeKey] = parsedRuntimeEnv;
      return accumulator;
    },
    {},
  );
};

export const readStudioRuntimeFieldEnvMap = (): StudioRuntimeFieldEnvMap => {
  const allowedRuntimeKeys = getStudioRuntimeVariableKeys();

  try {
    const rawValue = window.localStorage.getItem(
      STUDIO_RUNTIME_FIELD_ENV_MAP_STORAGE_KEY,
    );
    if (!rawValue) {
      return {};
    }

    return sanitizeStudioRuntimeFieldEnvMap({
      candidate: JSON.parse(rawValue),
      allowedRuntimeKeys,
    });
  } catch (_) {
    return {};
  }
};

export const writeStudioRuntimeFieldEnvMap = (
  runtimeFieldEnvMap: StudioRuntimeFieldEnvMap,
) => {
  const allowedRuntimeKeys = getStudioRuntimeVariableKeys();
  const sanitizedRuntimeFieldEnvMap = sanitizeStudioRuntimeFieldEnvMap({
    candidate: runtimeFieldEnvMap,
    allowedRuntimeKeys,
  });

  try {
    if (Object.keys(sanitizedRuntimeFieldEnvMap).length === 0) {
      window.localStorage.removeItem(STUDIO_RUNTIME_FIELD_ENV_MAP_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(
      STUDIO_RUNTIME_FIELD_ENV_MAP_STORAGE_KEY,
      JSON.stringify(sanitizedRuntimeFieldEnvMap),
    );
  } catch (_) {
    // noop
  }
};

export const clearStudioRuntimeFieldEnvMap = () => {
  try {
    window.localStorage.removeItem(STUDIO_RUNTIME_FIELD_ENV_MAP_STORAGE_KEY);
  } catch (_) {
    // noop
  }
};

export const applyStudioRuntimeFromStorage = (): StudioRuntimePayload => {
  const selectedRuntimeEnv = readStudioRuntimeEnv();
  const runtimePresets = readStudioRuntimePresets();
  const runtimeFieldEnvMap = readStudioRuntimeFieldEnvMap();
  const isApiEnvironmentOverrideEnabled =
    readStudioRuntimeApiEnvironmentOverride();
  const apiEnvironmentName = readStudioRuntimeApiEnvironmentName();

  const baseRuntimePayload =
    runtimePresets[selectedRuntimeEnv] ??
    runtimePresets[DEFAULT_STUDIO_RUNTIME_ENV] ??
    {};

  const mergedRuntimePayload: StudioRuntimePayload = {
    ...baseRuntimePayload,
  };

  Object.entries(runtimeFieldEnvMap).forEach(([runtimeKey, runtimeEnv]) => {
    const runtimeValue = runtimePresets[runtimeEnv]?.[runtimeKey];
    if (typeof runtimeValue === "string") {
      mergedRuntimePayload[runtimeKey] = runtimeValue;
    }
  });

  if (isApiEnvironmentOverrideEnabled) {
    mergedRuntimePayload[STUDIO_RUNTIME_API_BASE_URL_KEY] =
      buildStudioRuntimeApiBaseUrlFromEnvironmentName(apiEnvironmentName);
  }

  window.__SM_RUNTIME__ = mergedRuntimePayload;

  try {
    window.dispatchEvent(
      new CustomEvent(STUDIO_RUNTIME_UPDATED_EVENT, {
        detail: {
          runtime: mergedRuntimePayload,
          selectedRuntimeEnv,
          runtimeFieldEnvMap,
          isApiEnvironmentOverrideEnabled,
          apiEnvironmentName,
        },
      }),
    );
  } catch (_) {
    // noop
  }

  return mergedRuntimePayload;
};
