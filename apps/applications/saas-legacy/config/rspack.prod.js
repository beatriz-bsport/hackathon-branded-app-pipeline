const { merge } = require('webpack-merge');
const { rspack } = require('@rspack/core');
const { GenerateSW } = require('workbox-webpack-plugin');
const common = require('./rspack.common.js');
const paths = require('./paths.js');
const getClientEnvironment = require('./env');

const publicUrl = '';
const env = getClientEnvironment(publicUrl);

const cssFilename = 'static/css/[name].[contenthash:8].css';

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  devServer: {
    client: {
      overlay: false,
    },
  },
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new rspack.HtmlRspackPlugin({
      inject: true,
      template: paths.appHtml,
      templateParameters: env.raw,
      minify: true,
    }),

    new rspack.CssExtractRspackPlugin({
      filename: cssFilename,
      ignoreOrder: true,
      // Ignoring order as for our repo use CSS in js or BEM so we dont have css selector conflict
      // See more about it :
      // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250#issuecomment-415345126
    }),
    // Generate a service worker script that will precache, and keep up to date,
    // the HTML & assets that are part of the Rspack build.

    new GenerateSW({
      // This option instructs Workbox to not cache-bust URLs with hashes.
      dontCacheBustURLsMatching: /\.\w{8}\./,
      swDest: 'service-worker.js',
      clientsClaim: true,
      skipWaiting: true,
      navigateFallback: '/index.html',
      navigateFallbackDenylist: [/^\/__/], // This replaces navigateFallbackWhitelist
      exclude: [/\.map$/, /asset-manifest\.json$/],
    }),
  ],
});
