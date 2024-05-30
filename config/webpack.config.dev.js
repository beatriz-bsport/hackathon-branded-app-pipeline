const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const getClientEnvironment = require('./env');
const paths = require('./paths');

const publicPath = '/';
const publicUrl = '';
const env = getClientEnvironment(publicUrl);

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: [
    require.resolve('./polyfills'),
    require.resolve('react-dev-utils/webpackHotDevClient'),
    paths.appIndexJs,
  ],
  output: {
    pathinfo: true,
    filename: 'static/js/bundle.js',
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath,
    devtoolModuleFilenameTemplate: (info) =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    fallback: {
      fs: false,
    },
    modules: ['node_modules', paths.appNodeModules].concat(
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
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
      '#libs': path.resolve(__dirname, '../src/libs'),
      '#marketplacecomponents': path.resolve(
        __dirname,
        '../src/libs/marketplace/components'
      ),
      '#hocs': path.resolve(__dirname, '../src/hocs'),
      '#hooks': path.resolve(__dirname, '../src/hooks'),
      '#components': path.resolve(__dirname, '../src/components'),
      '#csscomponents': path.resolve(__dirname, '../src/components/css-only'),
      '#utils': path.resolve(__dirname, '../src/utils'),
      '#Fabrique': path.resolve(
        __dirname,
        '../src/components/css-only/Fabrique'
      ),
      '#untitledui': path.resolve(__dirname, '../src/components/untitledui'),
      '#pages': path.resolve(__dirname, '../src/pages'),
      '#state': path.resolve(__dirname, '../src/state'),
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
              plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-optional-chaining',
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
            use: ['style-loader', 'css-loader', 'sass-loader'],
          },
          {
            test: /\.css$/,
            use: [
              'style-loader',
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
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      templateParameters: env.raw,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      emitWarning: true,
    }),
  ],
  devServer: {
    historyApiFallback: true,
    port: 3000,
    hot: true,
    open: true,
    compress: true,
    client: {
      overlay: {
        errors: true,
        warnings: true,
      },
    },
    static: {
      directory: paths.appPublic,
      publicPath,
    },
  },
  performance: {
    hints: false,
  },
};
