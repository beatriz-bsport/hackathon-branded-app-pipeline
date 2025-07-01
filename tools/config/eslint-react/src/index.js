const globals = require("globals");
const pluginJs = require("@eslint/js");
const tseslint = require("typescript-eslint");
const js = require("@eslint/js");
const react = require("eslint-plugin-react");
const reactRefresh = require("eslint-plugin-react-refresh");
const reactHooks = require("eslint-plugin-react-hooks");

module.exports = [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      react,
    },
  },
  {
    settings: {
      react: {
        version: "detect",
      },
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          ecmaVersion: "latest",
          jsx: true,
          sourceType: "module",
        },
      },
    },
    plugins: {
      react,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      "react/jsx-no-target-blank": "off",
      "react/display-name": [0],
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": ["error", { caughtErrors: "none" }],
    },
  },
  reactHooks.configs["recommended-latest"],
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      // Build package
      "build/*",
      "dist/*",
      "coverage/*",
      // Storybook
      "storybook-static/*",
      // Hygen templates
      "_templates/*",
      // module federation temporal files
      ".__mf__temp/*",
    ],
  },
  {
    files: ["**/*.stories.@(ts|tsx|js|jsx)"],
    rules: {
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  },
];
