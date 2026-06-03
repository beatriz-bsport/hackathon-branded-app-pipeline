import bsportEslintReactConfig from "@bsport/config-eslint-react";

export default [
  ...bsportEslintReactConfig,
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: {
        process: "readonly",
      },
    },
  },
  {
    ignores: ["dist/**", ".generated/**", "lib/generated/**"],
  },
];
