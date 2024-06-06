const { merge } = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const common = require('./webpack.common.js');
const paths = require('./paths.js');
const getClientEnvironment = require('./env');

const publicUrl = '';
const env = getClientEnvironment(publicUrl);

const cssFilename = 'static/css/[name].[contenthash:8].css';

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      templateParameters: env.raw,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),

    new MiniCssExtractPlugin({
      filename: cssFilename,
      ignoreOrder: true,
      // Ignoring order as for our repo use CSS in js or BEM so we dont have css selector conflict
      // See more about it :
      // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250#issuecomment-415345126
    }),

    // Generate a manifest file which contains a mapping of all asset filenames
    // to their corresponding output file so that tools can pick it up without
    // having to parse `index.html`.
    new WebpackManifestPlugin({
      fileName: 'asset-manifest.json',
    }),
    // Generate a service worker script that will precache, and keep up to date,
    // the HTML & assets that are part of the Webpack build.

    new GenerateSW({
      // This option instructs Workbox to not cache-bust URLs with hashes.
      dontCacheBustURLsMatching: /\.\w{8}\./,
      swDest: 'service-worker.js',
      clientsClaim: true,
      skipWaiting: true,
      navigateFallback: `${paths.appPublic}/index.html`,
      navigateFallbackDenylist: [/^\/__/], // This replaces navigateFallbackWhitelist
      exclude: [/\.map$/, /asset-manifest\.json$/],
    }),
  ],
});
