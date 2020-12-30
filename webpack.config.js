const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const increaseSpecificity = require('postcss-increase-specificity');
const JavaScriptObfuscator = require('webpack-obfuscator');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const MinifyPlugin = require('babel-minify-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const devMode = process.env.NODE_ENV !== 'production';

const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, 'dist');

const defaultConfig = {
  mode: process.env.NODE_ENV || 'development',
  devServer: {
    contentBase: publicDir,
    port: 9000,
  },
  plugins: [
    // new CleanWebpackPlugin({protectWebpackAssets: false}),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
    new CopyPlugin([{ from: 'public', to: '.' }]),
    devMode ? null : new JavaScriptObfuscator(),
  ].filter((i) => i),
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(js|jsx|mjs|ts|tsx)$/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['react-app'],
                compact: true,
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
            },
          },
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.(scss|css)$/,
            use: [
              // fallback to style-loader in development
              // devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
              'style-loader',
              'css-loader',
              'cssimportant-loader',
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: [
                    increaseSpecificity({
                      stackableRoot: '.cleanslate',
                      repeat: 1,
                    }),
                  ],
                  sourceMap: devMode,
                },
              },
              'sass-loader',
            ],
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
    symlinks: false,
    alias: {
      react: path.resolve('./node_modules/react'),
    },
  },
};

module.exports = [
  {
    ...defaultConfig,
    entry: [
      devMode
        ? require.resolve('./config.dev')
        : require.resolve('./config.prod'),
      './src/outputs/widget.js',
    ],
    output: {
      path: distDir,
      publicPath: devMode
        ? 'http://localhost:9000/'
        : 'https://cdn.bsport.io/scripts/',
      filename: 'widget.js',
      library: 'BsportWidget',
      libraryExport: 'default',
      libraryTarget: 'window',
      chunkFilename: 'widget.[chunkhash:8].chunk.js',
    },
    plugins: [new MinifyPlugin()],
  },
];
