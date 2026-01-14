import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import type { StorybookConfig } from "@storybook/react-vite";
import { existsSync, readdirSync, statSync } from "fs";
import { join, resolve } from "path";
import tailwindcss from "tailwindcss";
import { fileURLToPath } from "url";
import { mergeConfig } from "vite";
import svgr from "vite-plugin-svgr";

const currentDir = fileURLToPath(new URL(".", import.meta.url));
const businessComponentsDir = join(currentDir, "../../business-components");
const coreSrcDir = resolve(currentDir, "../../primitive/core/src");

// Auto-discover all business component packages
const businessPackages = readdirSync(businessComponentsDir)
  .filter((name) => {
    const packagePath = join(businessComponentsDir, name);
    try {
      return (
        statSync(packagePath).isDirectory() &&
        name !== "node_modules" &&
        statSync(join(packagePath, "src/components")).isDirectory()
      );
    } catch {
      return false;
    }
  })
  .map((packageName) => ({
    directory: `../../business-components/${packageName}/src/components`,
    files: "**/*.stories.@(js|jsx|ts|tsx|mdx)",
    titlePrefix: `Business Components/${packageName.charAt(0).toUpperCase() + packageName.slice(1)}`,
  }));

const config: StorybookConfig = {
  stories: [
    // Primitive core components
    {
      directory: "../../primitive/core/src",
      files: "**/*.stories.@(js|jsx|ts|tsx|mdx)",
      titlePrefix: "Primitive",
    },
    // Business components - auto-discovered
    ...businessPackages,
  ],

  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
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

  viteFinal: async (config) => {
    // Set environment variable for business-components i18n
    config.define = {
      ...config.define,
      "import.meta.env.VITE_I18N_NAMESPACE_PREFIX": JSON.stringify(
        "kaizen-business-financial-services",
      ),
    };

    // Resolve #src for business-components files
    const resolveBusinessComponentsSrc = () => ({
      name: "resolve-business-components-src",
      enforce: "pre",
      resolveId(id: string, importer?: string) {
        if (!id.startsWith("#src/") || !importer) return null;

        const normalizedImporter = importer.replace(/\\/g, "/");

        // Handle business-components package
        const businessMatch = normalizedImporter.match(
          /business-components\/([^/]+)\//,
        );
        if (businessMatch) {
          const packageName = businessMatch[1];
          const packageSrc = join(businessComponentsDir, packageName, "src");
          const resolved = join(packageSrc, id.replace("#src/", ""));
          for (const ext of [".ts", ".tsx"]) {
            const withExt = resolved + ext;
            if (existsSync(withExt)) {
              return withExt;
            }
          }
          if (existsSync(resolved)) {
            for (const index of ["index.ts", "index.tsx"]) {
              const indexPath = join(resolved, index);
              if (existsSync(indexPath)) {
                return indexPath;
              }
            }
          }
          return null;
        }

        // Handle primitive/core
        if (normalizedImporter.includes("primitive/core")) {
          const resolved = join(coreSrcDir, id.replace("#src/", ""));
          for (const ext of [".ts", ".tsx"]) {
            const withExt = resolved + ext;
            if (existsSync(withExt)) {
              return withExt;
            }
          }
          if (existsSync(resolved)) {
            for (const index of ["index.ts", "index.tsx"]) {
              const indexPath = join(resolved, index);
              if (existsSync(indexPath)) {
                return indexPath;
              }
            }
          }
          return null;
        }

        return null;
      },
    });

    return mergeConfig(config, {
      plugins: [svgr(), nxViteTsPaths(), resolveBusinessComponentsSrc()],
      css: {
        postcss: {
          plugins: [tailwindcss()],
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
        esbuildOptions: {
          jsx: "automatic",
        },
      },
      build: {
        commonjsOptions: {
          include: [/node_modules/],
        },
      },
      esbuild: {
        jsx: "automatic",
      },
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

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/recipes/storybook/custom-builder-configs
