const globals = require("globals");
const pluginJs = require("@eslint/js");
const tseslint = require("typescript-eslint");
const pluginReact = require("eslint-plugin-react");

module.exports = [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      pluginReact,
    },
  },
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: globals.browser,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { caughtErrors: "none" }],
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["dist/*", "build/*"],
  },
];
