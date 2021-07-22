const custom = require('../config/webpack.config.dev');
const path = require("path");
module.exports = {
  "stories": [
    "../src/**/*.storiess.mdx",
    "../src/**/*.storiess.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    '@storybook/addon-a11y/register',
    '@storybook/addon-actions/register',
    '@storybook/addon-knobs/register',
    path.resolve("./.storybook/ts-preset"),
  ],
   typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
   },
  

  // .storybook/main.js

// your app's webpack.config.js
 //   webpackFinal: (config) => {
 //     return { ...config, module: { ...config.module, rules: custom.module.rules } };
 //   },
};
