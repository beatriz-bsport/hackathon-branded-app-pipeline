import { existsSync } from "fs";
import { resolve } from "path";
import type { Plugin } from "vite";

const RUNTIME_ENV_FILENAME = "env.js";

const normalizeRuntimeEnvValue = (value?: string) => {
  const normalizedValue = value?.trim();
  return normalizedValue ? normalizedValue : "";
};

export const buildRuntimeEnvSource = ({
  apiBaseUrl,
}: {
  apiBaseUrl?: string;
}) => {
  const normalizedApiBaseUrl = JSON.stringify(
    normalizeRuntimeEnvValue(apiBaseUrl),
  );

  return `window.runtime = window.runtime || { env: {} };
window.runtime.env = window.runtime.env || {};
var env = window.runtime.env;

if (env.VITE_API_BASE_URL === undefined) {
  env.VITE_API_BASE_URL = ${normalizedApiBaseUrl};
}
`;
};

export const runtimeEnvPlugin = ({
  rootDir,
  envScriptPath,
  initialApiBaseUrl,
}: {
  rootDir: string;
  envScriptPath: string;
  initialApiBaseUrl?: string;
}): Plugin => {
  const publicEnvFilePath = resolve(rootDir, "public", RUNTIME_ENV_FILENAME);
  const hasPublicEnvFile = existsSync(publicEnvFilePath);

  const runtimeEnvSource = buildRuntimeEnvSource({
    apiBaseUrl: initialApiBaseUrl,
  });

  return {
    name: "@bsport/runtime-env-plugin",
    transformIndexHtml(html) {
      if (html.includes(RUNTIME_ENV_FILENAME)) {
        return html;
      }

      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: { src: envScriptPath },
            injectTo: "head-prepend",
          },
        ],
      };
    },
    configureServer(server) {
      if (hasPublicEnvFile) {
        return;
      }

      server.middlewares.use((req, res, next) => {
        const requestPath = req.url?.split("?")[0];
        if (requestPath !== envScriptPath) {
          next();
          return;
        }

        res.setHeader("Content-Type", "application/javascript; charset=utf-8");
        res.end(runtimeEnvSource);
      });
    },
    generateBundle() {
      if (hasPublicEnvFile) {
        return;
      }

      this.emitFile({
        type: "asset",
        fileName: RUNTIME_ENV_FILENAME,
        source: runtimeEnvSource,
      });
    },
  };
};
