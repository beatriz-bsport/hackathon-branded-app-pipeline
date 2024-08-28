import React from "react";
import type { Preview } from "@storybook/react";
import "../src/index.css";

import { withThemeByClassName } from "@storybook/addon-themes";

const preview: Preview = {
  decorators: [
    (Story) => {
      return <Story />;
    },
    withThemeByClassName({
      themes: {
        // nameOfTheme: 'classNameForTheme',
        light: "kz-light",
        dark: "kz-dark",
      },
      defaultTheme: "light",
    }),
  ],

  parameters: {
    backgrounds: {
      default: "default",
      values: [
        { name: "default", value: "#f0f0f0" },
        { name: "strong", value: "#484848" },
      ],
    },
  },

  tags: ["autodocs"],
};

export default preview;
