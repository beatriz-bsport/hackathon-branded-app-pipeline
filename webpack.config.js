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
            test: /\.(js|jsx|mjs)$/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['react-app'],
                compact: true,
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
    extensions: ['*', '.js', '.jsx'],
    symlinks: false,
  },
};

module.exports = [
  {
    ...defaultConfig,
    entry: './src/outputs/widget.js',
    output: {
      path: distDir,
      publicPath: '/',
      filename: 'widget.js',
      library: 'BsportWidget',
      libraryExport: 'default',
      libraryTarget: 'window',
      chunkFilename: 'widget.[chunkhash:8].chunk.js',
    },
    plugins: [new MinifyPlugin()],
  },
];
