// Runtime value takes precedence (injected at deployment time)
// Falls back to build-time value for local development
const getReleaseVersion = (): string | undefined => {
  if (typeof window !== "undefined") {
    const runtimeSha = (window as Window & { __BSPORT_RELEASE_SHA__?: string })
      .__BSPORT_RELEASE_SHA__;
    // Only use runtime value if it's been replaced (not the placeholder)
    if (runtimeSha && runtimeSha !== "__RELEASE_SHA_PLACEHOLDER__") {
      return runtimeSha;
    }
  }
  return process.env.VITE_RELEASE_SHA;
};

export const RELEASE_SHA = getReleaseVersion();

export const INTERCOM_APP_ID = "q6foivp2";

export const DEFAULT_LANGUAGE_OVERRIDE = "en_EN";
export const DEFAULT_CUSTOM_LAUNCHER_SELECTOR = "#intercomIcon";
export const DEFAULT_ACTION_COLOR = "#149e7a"; // bsport green

/** Regex to validate email format (used as user_id for Intercom). */
export const EMAIL_VALIDATION_REGEXP = /^(.*)+@(.*)\.(.*)/;
