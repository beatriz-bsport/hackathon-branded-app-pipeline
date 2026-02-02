import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import type { StorybookConfig } from "@storybook/react-vite";
import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";
import tailwindcss from "tailwindcss";
import { fileURLToPath } from "url";
import { mergeConfig } from "vite";
import svgr from "vite-plugin-svgr";

const currentDir = fileURLToPath(new URL(".", import.meta.url));
const businessComponentsDir = join(currentDir, "..");

// Auto-discover all business component packages
const businessPackages = readdirSync(businessComponentsDir)
  .filter((name) => {
    const packagePath = join(businessComponentsDir, name);
    try {
      return (
        statSync(packagePath).isDirectory() &&
        name !== "node_modules" &&
        name !== ".storybook" &&
        statSync(join(packagePath, "src/components")).isDirectory()
      );
    } catch {
      return false;
    }
  })
  .map((packageName) => ({
    directory: `../${packageName}/src/components`,
    files: "**/*.stories.@(js|jsx|ts|tsx|mdx)",
    titlePrefix: packageName.charAt(0).toUpperCase() + packageName.slice(1),
  }));

const config: StorybookConfig = {
  stories: businessPackages,

  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-themes",
    "@chromatic-com/storybook",
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  core: {
    disableTelemetry: true,
  },

  features: {
    actions: true,
    controls: true,
  },

  viteFinal: async (config, { configType }) => {
    if (configType === "DEVELOPMENT") {
      config.server = config.server || {};
      config.server.port = 6007;
    }

    // Custom plugin to resolve #src aliases dynamically based on importing file location
    const resolveSrcAliasPlugin = () => {
      return {
        name: "resolve-src-alias",
        enforce: "pre",
        resolveId(id: string, importer?: string) {
          if (!id.startsWith("#src/") || !importer) return null;

          // Find which business component package this import is from
          const importerPath = importer.replace(/\\/g, "/");
          const match = importerPath.match(
            /business-components\/([^/]+)\/src\//,
          );
          if (!match) return null;

          const packageName = match[1];
          const packageSrcDir = join(businessComponentsDir, packageName, "src");
          const relativePath = id.replace("#src/", "");
          const resolvedPath = join(packageSrcDir, relativePath);

          // Handle directory imports (e.g., #src/components/I18nProvider -> #src/components/I18nProvider/index.tsx)
          if (existsSync(resolvedPath)) {
            const stat = statSync(resolvedPath);
            if (stat.isDirectory()) {
              const indexFiles = ["index.tsx", "index.ts"];
              for (const indexFile of indexFiles) {
                const indexPath = join(resolvedPath, indexFile);
                if (existsSync(indexPath)) {
                  return indexPath;
                }
              }
            }
            return resolvedPath;
          }

          const extensions = [".tsx", ".ts"];
          for (const ext of extensions) {
            const withExt = resolvedPath + ext;
            if (existsSync(withExt)) {
              return withExt;
            }
          }

          return null;
        },
      };
    };

    return mergeConfig(config, {
      plugins: [svgr(), nxViteTsPaths(), resolveSrcAliasPlugin()],
      css: {
        postcss: {
          plugins: [
            tailwindcss({
              config: join(currentDir, "tailwind.config.js"),
            }),
          ],
        },
      },
      optimizeDeps: {
        include: [
          ...(config.optimizeDeps?.include || []),
          "react",
          "react-dom",
          "react/jsx-runtime",
          "react/jsx-dev-runtime",
        ],
        esbuildOptions: { jsx: "automatic" },
      },
      build: { commonjsOptions: { include: [/node_modules/] } },
      esbuild: { jsx: "automatic" },
    });
  },

  docs: {},

  typescript: {
    // Disable docgen addon as it is not installed and does not support
    // usage of internal @bsport/i18n
    reactDocgen: false,
  },
};

export default config;
