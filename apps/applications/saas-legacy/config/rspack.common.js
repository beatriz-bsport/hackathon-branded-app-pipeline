const { rspack } = require('@rspack/core');
const autoprefixer = require('autoprefixer');
const path = require('path');
const paths = require('./paths');
const getClientEnvironment = require('./env');
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const publicPath = '/';
const isProduction = process.env.NODE_ENV === 'production';
const env = getClientEnvironment('');
const styleOrExtractLoader = isProduction
  ? rspack.CssExtractRspackPlugin.loader
  : 'style-loader';

const plugins = [
  new rspack.ProvidePlugin({
    process: 'process/browser.js',
  }),
  new rspack.DefinePlugin(env.stringified),
];

if (
  isProduction &&
  process.env.SENTRY_ORG &&
  process.env.SENTRY_PROJECT &&
  process.env.SENTRY_AUTH_TOKEN
) {
  plugins.push(
    sentryWebpackPlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  );
}

if (process.env.ANALYZE === 'true') {
  plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
}

module.exports = {
  entry: [require.resolve('./polyfills'), paths.appIndexJs],
  output: {
    pathinfo: true,
    path: paths.appBuild,
    filename: 'static/js/[name].[contenthash].js',
    chunkFilename: 'static/js/[name].[contenthash].chunk.js',
    publicPath,
    devtoolModuleFilenameTemplate: (info) =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    fallback: {
      fs: false,
    },
    modules: ['node_modules', paths.appNodeModules],
    extensions: [
      '.web.js',
      '.mjs',
      '.js',
      '.json',
      '.web.jsx',
      '.ts',
      '.tsx',
      '.jsx',
    ],
    alias: {
      'react-native': 'react-native-web',
      '#src': path.resolve(__dirname, '../src'),
      '#Fabrique': path.resolve(
        __dirname,
        '../src/components/css-only/Fabrique',
      ),
      // Necessary to make unleash proxy work:
      // Hook requires to have only 1 react verion
      react: path.resolve(__dirname, '../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../node_modules/react-dom'),
    },
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        oneOf: [
          {
            resourceQuery: /raw/,
            type: 'asset/source',
          },
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 10000,
              },
            },
            generator: {
              filename: 'static/media/[name].[hash:8][ext]',
            },
          },
          {
            test: /\.(js|jsx|mjs|ts|tsx)$/,
            include: [paths.appSrc, /node_modules\/i18next-http-backend/],
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              sourceMaps: true,
              plugins: [
                '@babel/plugin-transform-class-properties',
                '@babel/plugin-transform-optional-chaining',
              ],
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
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
          },
          {
            test: [/\.scss$/, /\.sass$/],
            include: paths.appSrc,
            use: [styleOrExtractLoader, 'css-loader', 'sass-loader'],
          },
          {
            test: /\.css$/,
            use: [
              styleOrExtractLoader,
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: [
                      'postcss-flexbugs-fixes',
                      autoprefixer({
                        overrideBrowserslist: [
                          '>1%',
                          'last 4 versions',
                          'Firefox ESR',
                          'not ie < 9',
                        ],
                        flexbox: 'no-2009',
                      }),
                    ],
                  },
                },
              },
            ],
          },
          {
            exclude: [/\.(js|jsx|ts|tsx|mjs)$/, /\.html$/, /\.json$/],
            type: 'asset/resource',
            generator: {
              filename: 'static/media/[name].[hash:8][ext]',
            },
          },
        ],
      },
    ],
  },
  plugins,
  performance: {
    hints: false,
  },
};
