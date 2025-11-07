import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import type { StorybookConfig } from "@storybook/react-vite";
import { readdirSync, statSync } from "fs";
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

  viteFinal: async (config, { configType }) => {
    if (configType === "DEVELOPMENT") {
      config.server = config.server || {};
      config.server.port = 6007;
    }
    return mergeConfig(config, {
      plugins: [svgr(), nxViteTsPaths()],
      css: {
        postcss: {
          plugins: [tailwindcss()],
        },
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
