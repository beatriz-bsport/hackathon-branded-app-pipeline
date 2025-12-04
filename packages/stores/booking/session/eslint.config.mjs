import pluginQuery from "@tanstack/eslint-plugin-query";

import bsportEslintReactConfig from "@bsport/config-eslint-react";

export default [
  ...pluginQuery.configs["flat/recommended"],
  ...bsportEslintReactConfig,
];
