const path = require("path");
const paths = require('../config/paths');
const SRC_PATH = path.join(__dirname, '../src');
const STORIES_PATH = path.join(__dirname, '../stories');
//dont need stories path if you have your stories inside your //components folder
module.exports = ({config}) => {
  config.module.rules.push(

          // Process JS with Babel.
          {
            test: /\.(js|jsx|mjs|ts|tsx)$/,
            include: [paths.appSrc, /node_modules\/i18next-http-backend/],
            loader: require.resolve('babel-loader'),
            options: {
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,

              plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-optional-chaining',
              ],
              presets: [
                [
                  '@babel/preset-env',

                  {
                    targets: {
                      // The % refers to the global coverage of users from browserslist
                      browsers: [
                        '>0.1%',
                        'iOS >= 9',
                        'Safari >= 6',
                        'ie >= 11',
                      ],
                    },

                    useBuiltIns: 'entry',
                    corejs: 3,
                  },
                ],
                '@babel/preset-react',
                '@babel/preset-flow',
              ],
              overrides: [
                {
                  test: /\.(ts|tsx)$/,
                  presets: [
                    '@babel/preset-typescript',
                    [
                      '@babel/preset-env',

                      {
                        targets: {
                          // The % refers to the global coverage of users from browserslist
                          browsers: [
                            '>0.1%',
                            'iOS >= 9',
                            'Safari >= 6',
                            'ie >= 11',
                          ],
                        },

                        useBuiltIns: 'entry',
                        corejs: 3,
                      },
                    ],
                    '@babel/preset-react',
                  ],
                },
              ],
            },
          }

  ),

  //   push({
  //   test: /\.(ts|tsx |js|jsx)$/,
  //   include: [SRC_PATH, STORIES_PATH],
  //     use: [
  //       {
  //         loader: require.resolve("awesome-typescript-loader"),
  //         options: {
  //           configFileName: './tsconfig.json'
  //         }
  //       },
  //       { loader: require.resolve("react-docgen-typescript-loader") }
  //     ]
  // });
  config.resolve.extensions.push(".ts", "js", "jsx", ".tsx");
  return config;
};
