const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const increaseSpecificity = require('postcss-increase-specificity');
const JavaScriptObfuscator = require('webpack-obfuscator');
const CopyPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');
const path = require('path');

const devMode = process.env.NODE_ENV !== 'production';

const getConfig = () => {
  const configOverride = process.env.DEST_CONFIG;
  if (
    configOverride &&
    ['local', 'dev', 'production', 'staging', 'local-fe-dev-be'].includes(
      configOverride,
    )
  ) {
    return `./config.${configOverride}`;
  }
  if (devMode) {
    return './config.local';
  }
  return './config.production';
};

const publicPath = devMode
  ? 'http://localhost:3100/'
  : `https://${process.env.CDN_DOMAIN}/scripts/`;
const distDir = path.join(__dirname, 'dist');
const publicDir = path.join(__dirname, 'public');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: [require.resolve(getConfig()), './src/index.tsx'],
  output: {
    path: distDir,
    filename: 'widget.js',
    chunkFilename: 'widget.[chunkhash:8].chunk.js',
    publicPath,
    library: 'BsportWidget',
    libraryExport: 'default',
    libraryTarget: 'window',
  },
  devServer: {
    static: publicDir,
    port: 3100,
  },
  resolve: {
    fallback: {
      fs: false,
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      react: path.resolve('./node_modules/react'),
      '#src': path.resolve(__dirname, './node_modules/@bsport/saas-legacy/src'),
      '#Fabrique': path.resolve(
        __dirname,
        './node_modules/@bsport/saas-legacy/src/components/css-only/Fabrique',
      ),
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
            test: /\.(js|jsx|mjs|ts|tsx)$/,
            use: {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                presets: [
                  '@babel/preset-env',
                  '@babel/preset-react',
                  '@babel/preset-typescript',
                  '@babel/preset-flow',
                ],
                plugins: [
                  '@babel/plugin-syntax-dynamic-import',
                  '@babel/plugin-syntax-import-meta',
                  '@babel/plugin-transform-class-properties',
                  '@babel/plugin-proposal-function-sent',
                  '@babel/plugin-transform-export-namespace-from',
                  '@babel/plugin-transform-numeric-separator',
                  '@babel/plugin-proposal-throw-expressions',
                  '@babel/plugin-proposal-optional-chaining',
                  '@babel/plugin-proposal-nullish-coalescing-operator',
                  '@babel/plugin-transform-optional-chaining',
                ],
              },
            },
            exclude: /node_modules/,
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
            test: /\.(scss|css)$/,
            exclude: [/reset\.css$/, /\.css\?raw$/],
            use: [
              'style-loader',
              'css-loader',
              'sass-loader',
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: [
                    increaseSpecificity({
                      stackableRoot: '[id*="bsport-widget"] .cleanslate',
                      repeat: 1,
                    }),
                  ],
                  sourceMap: devMode,
                },
              },
            ],
          },
          {
            test: /reset\.css$/,
            use: ['style-loader', 'css-loader'],
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
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[contenthash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[contenthash].css',
      ignoreOrder: true,
    }),
    new CopyPlugin({ patterns: [{ from: 'public', to: '.' }] }),
    !devMode && new JavaScriptObfuscator(),
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
    }),
  ].filter(Boolean),
  optimization: {
    minimize: !devMode,
  },
  performance: {
    hints: false,
  },
};
