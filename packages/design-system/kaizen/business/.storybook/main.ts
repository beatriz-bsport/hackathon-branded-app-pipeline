import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import type { StorybookConfig } from "@storybook/react-vite";
import { join } from "path";
import tailwindcss from "tailwindcss";
import { fileURLToPath } from "url";
import { mergeConfig } from "vite";
import svgr from "vite-plugin-svgr";

const currentDir = fileURLToPath(new URL(".", import.meta.url));

const config: StorybookConfig = {
  stories: ["../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))"],

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

    return mergeConfig(config, {
      plugins: [svgr(), nxViteTsPaths()],
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
