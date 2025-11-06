import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "tailwindcss";
import { mergeConfig } from "vite";
import svgr from "vite-plugin-svgr";

const config: StorybookConfig = {
  stories: ["../**/src/**/*.stories.@(js|jsx|ts|tsx|mdx)"],

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
