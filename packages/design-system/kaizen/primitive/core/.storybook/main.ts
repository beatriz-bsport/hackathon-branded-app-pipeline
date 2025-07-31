import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "tailwindcss";
import { mergeConfig } from "vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

const config: StorybookConfig = {
  stories: ["../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))"],

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

  // https://storybook.js.org/recipes/tailwindcss#3-add-a-theme-switcher-tool
  viteFinal: async (config) =>
    mergeConfig(config, {
      plugins: [svgr(), tsconfigPaths()],
      css: {
        postcss: {
          plugins: [tailwindcss()],
        },
      },
    }),

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
