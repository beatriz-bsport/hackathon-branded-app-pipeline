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
    //
    // Scope: this service worker is generated only for the legacy SaaS app and
    // is registered at the origin root ('/'), so it intercepts navigations for
    // the WHOLE origin — including paths owned by other apps such as Studio
    // Manager under /studio/*. The denylist below is what keeps those paths out
    // of the legacy app's control.
    // GenerateSW works by tapping into the compiler/compilation lifecycle
    // hooks (tapable) to read the list of emitted assets and generate the service-worker precache manifest.
    // Rspack does not ship a native Workbox equivalent, so workbox-webpack-plugin remains the standard choice
    // Or we can use this one recommended: https://github.com/Clarkkkk/workbox-rspack-plugin
    new GenerateSW({
      // This option instructs Workbox to not cache-bust URLs with hashes.
      dontCacheBustURLsMatching: /\.\w{8}\./,
      swDest: 'service-worker.js',
      clientsClaim: true, // SW immediately takes control of ALL open tabs on activation
      skipWaiting: true, // SW activates immediately without waiting
      // + no chunk exclusions = precaches EVERY chunk file on install
      // For SPA routing, any navigation that isn't a precached URL is served
      // the legacy app shell (/index.html) so client-side routing can take over.
      navigateFallback: '/index.html',
      // ...EXCEPT navigations matching these patterns, which the service worker
      // must NOT answer from cache. They fall through to the network so the
      // server can respond with the correct app shell:
      //   /^\/__/      → internal/dev endpoints (e.g. /__webpack_hmr).
      //   /^\/studio/  → Studio Manager. Without this, the SW would serve the
      //                  legacy /index.html for /studio/* and boot the legacy
      //                  app (loader flash, wrong app), instead of letting the
      //                  server return Studio Manager's own shell.
      navigateFallbackDenylist: [/^\/__/, /^\/studio/],
      exclude: [
        /\.map$/,
        /asset-manifest\.json$/,
        /\.chunk\.js$/, // ← KEY: don't precache lazy JS chunks on install
        /\.chunk\.css$/, // ← same for CSS chunks
        /LICENSE\.txt$/, // ← no need to cache license files
      ],
      // ✅ Cache chunks lazily, the first time the app actually requests them
      runtimeCaching: [
        {
          urlPattern: /\/static\/js\/.*\.chunk\.js$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'js-chunks',
            expiration: {
              maxEntries: 300,
              maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year — safe, they're hashed
            },
          },
        },
        {
          urlPattern: /\/static\/css\/.*\.chunk\.css$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'css-chunks',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 365 * 24 * 60 * 60,
            },
          },
        },
      ],
    }),
  ],
});
