import { federation } from "@module-federation/vite";
import { type PreviewOptions, type ServerOptions, type UserConfig } from "vite";
import { z } from "zod";

export const AppTypesEnum = z.enum(
  [
    "hosts",
    "shared",
    "core-data",
    "buyables",
    "booking",
    "financial-services",
    "customer-data-platform",
    "business-insights",
    "communication",
  ],
  {
    description:
      "Application types:\n      - hosts: main applications\n      - shared: packages used in more than one host\n      - others: domain specific applications",
  },
);

export type AppTypes = z.infer<typeof AppTypesEnum>;

const PORT_RANGES: Record<AppTypes, [number, number]> = {
  hosts: [4000, 4049],
  shared: [4050, 4099],
  "core-data": [4100, 4149],
  buyables: [4150, 4199],
  booking: [4200, 4249],
  "financial-services": [4250, 4299],
  "customer-data-platform": [4300, 4349],
  "business-insights": [4350, 4399],
  communication: [4400, 4449],
} as const;

const ConfigSchema = z
  .object({
    appType: AppTypesEnum,
    packageJson: z.object(
      {
        name: z.string(),
        dependencies: z.record(z.string(), z.string()),
        federation: z.object({
          devPort: z.number({
            message:
              "the devPort must be a number if you have not added federation.devPort in package.json please add it",
          }),
          name: z.string().optional(),
          remotes: z
            .record(
              z.string(),
              z.object({
                devPort: z.number({
                  message:
                    "the devPort must match the port of the remote app, please check the package.json federation.devPort in the remote module",
                }),
                watchPath: z.string().optional(),
              }),
            )
            .optional(),
          exposes: z.record(z.string(), z.string()).optional(),
        }),
      },
      {
        description:
          "Federation configuration in the custom 'federation' field in the package.json, refer to the README.md to know more",
      },
    ),
    mode: z.enum(["development", "production", "preview"], {
      description: "Build mode meant to be used with vite's mode",
    }),
  })
  .refine(
    (data) => {
      const [min, max] = PORT_RANGES[data.appType];
      const { devPort } = data.packageJson.federation;

      return devPort >= min && devPort <= max;
    },
    (data) => ({
      message: `Port ${data.packageJson.federation.devPort} is outside the valid range [${PORT_RANGES[data.appType][0]}, ${PORT_RANGES[data.appType][1]}] for app type ${data.appType}. Also make sure to select an unused port`,
      path: ["federation", "devPort"],
    }),
  );

/**
 * Generates and validates configuration for a federated module
 * @param {Object} config - Configuration object for the module
 * @param {AppTypes} config.appType - Type of the application (hosts, shared, core-data, etc.)
 * @param {string} config.mode - Build mode ('development' or 'preview')
 * @param {Object} config.packageJson - Package.json configuration validated against ConfigSchema
 * @returns {Object} Validated configuration object for the federated module
 * @throws {Error} If configuration validation fails
 * @example
 * import packageJson from "./package.json";
 *
 * export default defineConfig(({ mode }) => {
 *    const config = getConfig({
 *      appType: "hosts",
 *      mode,
 *      packageJson,
 *    });
 *    return {
 *      base: config.base,
 *      server: config.server,
 *      preview: config.preview,
 *      define: config.define,
 *      plugins: [
 *        nxViteTsPaths(),
 *        svgr(),
 *        react(),
 *        topLevelAwait(),
 *        federation(config.federation),
 *      ],
 *   };
 * });
 */
export const getConfig = (config: {
  appType: AppTypes;
  mode: string;
  packageJson: z.infer<typeof ConfigSchema>["packageJson"];
}) => {
  const result = ConfigSchema.safeParse(config);

  if (!result.success) {
    const errorMessage = result.error.issues
      .map((issue) => issue.message)
      .join("\n");

    console.error("\nVite config validation error:\n", errorMessage, "\n");
    throw new Error(errorMessage);
  }

  const { packageJson, mode } = result.data;
  const isHost = !!packageJson.federation.remotes;
  const isLocal = mode === "preview" || mode === "development";
  const { devPort, name: federationName, exposes } = packageJson.federation;

  const base = getBase({ isHost, appName: packageJson.name, isLocal });

  /**
   * Why remove the trailing slash?
   * In production the i18n URL already has a slash for building the URL for the locales location
   * so we have to remove it to avoid double slashes
   */
  const i18nUrl = isLocal ? `http://localhost:${devPort}` : base.slice(0, -1);

  /**
   * For now we instantiate i18n using env variables
   * Since we need to locate the i18n files it is related
   * to the federation config
   */
  const define: NonNullable<UserConfig["define"]> = {
    "import.meta.env.VITE_I18N_NAMESPACE_PREFIX": JSON.stringify(
      removeScope(packageJson.name),
    ),
    "import.meta.env.VITE_APPLICATION_BASE_URL": JSON.stringify(i18nUrl),
  };

  const server: ServerOptions = {
    port: devPort,
  };

  const preview: PreviewOptions = {
    port: devPort,
  };

  const federationConfig: Parameters<typeof federation>[0] = {
    name: federationName || removeScope(packageJson.name),
    filename: "remoteEntry.js",
    manifest: {
      fileName: "mf-manifest.json",
    },
    shared: {
      react: {
        singleton: true,
        requiredVersion: packageJson.dependencies["react"] ?? "19.0.0",
      },
      "react-dom": {
        singleton: true,
        requiredVersion: packageJson.dependencies["react-dom"] ?? "19.0.0",
      },
      "react-router": {
        singleton: true,
        requiredVersion: packageJson.dependencies["react-router"] ?? "7.2.0",
      },
      "@bsport/i18n": {
        singleton: true,
      },
      "@bsport/kaizen-primitive-core": {
        singleton: true,
      },
    },
    exposes,
  };

  const pathsToWatch: string[] = [];
  // Add remotes configuration if present in package.json
  if (packageJson.federation.remotes) {
    federationConfig.remotes = Object.entries(
      packageJson.federation.remotes,
    ).reduce(
      (acc, [key, remote]) => {
        if (remote.watchPath) {
          pathsToWatch.push(remote.watchPath);
        }

        return {
          ...acc,
          [key]: {
            name: key,
            type: "module",
            entry: isLocal
              ? `http://localhost:${remote.devPort}/remoteEntry.js`
              : `/v2/apps/${removePrefix(key)}/remoteEntry.js`,
          },
        };
      },

      {},
    );
  }

  return {
    define,
    base,
    server,
    preview,
    federation: federationConfig,
    pathsToWatch,
  };
};

function getBase({
  isHost,
  appName,
  isLocal,
}: {
  isHost: boolean;
  appName: string;
  isLocal: boolean;
}) {
  if (isLocal) {
    return "/";
  }

  /**
   * we want to remove the @bsport/ scope and the application prefix of the application
   * e.g. @bsport/sm-navigation-sidebar -> navigation-sidebar
   */
  const name = compose(removeScope, removePrefix)(appName);

  return isHost ? "/v2/" : `/v2/apps/${name}/`;
}

function removeScope(name: string) {
  return name.replace("@bsport/", "");
}

function removePrefix(name: string) {
  return name.replace(/^[^-]+-/, "");
}

function compose<T>(...fns: Array<(x: T) => T>): (x: T) => T {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}
