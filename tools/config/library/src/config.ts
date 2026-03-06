import { resolve } from "path";
import type { Plugin, UserConfig } from "vite";
import dts from "vite-plugin-dts";
import { z } from "zod";

import { getConfig } from "@bsport/config-federation";

const AppTypesEnum = z.enum([
  "hosts",
  "shared",
  "core-data",
  "buyables",
  "booking",
  "financial-services",
  "customer-data-platform",
  "business-insights",
  "communication",
]);

type AppTypes = z.infer<typeof AppTypesEnum>;

const LibConfigSchema = z.object({
  mode: z.enum(["development", "production", "preview", "compat"]),
  packageJson: z.object({
    name: z.string(),
    dependencies: z.record(z.string(), z.string()).optional().default({}),
    peerDependencies: z.record(z.string(), z.string()).optional().default({}),
    federation: z.object({
      devPort: z.number(),
      name: z.string().optional(),
      remotes: z
        .record(
          z.string(),
          z.object({
            devPort: z.number(),
            watchPath: z.string().optional(),
          }),
        )
        .optional(),
      exposes: z.record(z.string(), z.string()).optional(),
    }),
  }),
  rootDir: z.string(),
  appType: AppTypesEnum,
});

export function getLibConfig(config: {
  mode: string;
  packageJson: z.infer<typeof LibConfigSchema>["packageJson"];
  rootDir: string;
  appType: AppTypes;
}): UserConfig {
  const result = LibConfigSchema.safeParse(config);

  if (!result.success) {
    const errorMessage = result.error.issues
      .map((issue) => issue.message)
      .join("\n");

    console.error("\nVite config validation error:\n", errorMessage, "\n");
    throw new Error(errorMessage);
  }

  const { mode, packageJson, rootDir, appType } = result.data;

  if (mode !== "production") {
    return getConfig({
      mode,
      packageJson: {
        name: packageJson.name,
        dependencies: packageJson.dependencies,
        federation: packageJson.federation,
      },
      appType,
      rootDir,
    });
  }

  const { name } = packageJson;
  const peerDependencies = Object.keys(packageJson.peerDependencies);
  const jsxRuntimeExternals = ["react/jsx-runtime", "react/jsx-dev-runtime"];
  const namespace = compose(
    uppercase,
    replaceHyphens,
    removeScope,
    removePrefix,
  )(name);

  return {
    plugins: [
      dts({
        tsconfigPath: "./tsconfig.app.json",
        outDir: "build",
        entryRoot: "src",
        rollupTypes: true,
      }),
    ],
    resolve: {
      alias: {
        "#src": resolve(rootDir, "./src"),
      },
    },
    define: {
      [`__${namespace}__`]: JSON.stringify({
        __I18N_NAMESPACE_PREFIX__: removeScope(name),
        __SENTRY_SCOPE_TAG__: removeScope(name),
        __APPLICATION_BASE_URL__: "",
        __BASENAME__: "/",
      }),
    },
    build: {
      outDir: "build",
      lib: {
        entry: resolve(rootDir, "src/App.tsx"),
        fileName: "lib.es",
        formats: ["es"],
      },
      rollupOptions: {
        external: [...peerDependencies, ...jsxRuntimeExternals],
        plugins: [injectReactPlugin()],
      },
      sourcemap: true,
    },
  };
}

function injectReactPlugin(): Plugin {
  return {
    name: "inject-react-namespace",
    renderChunk(code) {
      const hasReactImport =
        /import\s+\*\s+as\s+React\s+from\s+['"]react['"]/.test(code);

      if (hasReactImport) return null;

      const codeWithoutComments = code
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/.*/g, "");
      const usesReactGlobal = /\bReact\./.test(codeWithoutComments);

      if (usesReactGlobal) {
        return { code: 'import * as React from "react";\n' + code, map: null };
      }

      return null;
    },
  };
}

function removeScope(name: string) {
  return name.replace(/@bsport\//i, "");
}

function removePrefix(name: string) {
  return name.replace(/^[^-]+-/, "");
}

function uppercase(name: string) {
  return name.toUpperCase();
}

function replaceHyphens(name: string) {
  return name.replace(/-/g, "_");
}

function compose<T>(...fns: Array<(x: T) => T>): (x: T) => T {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}
