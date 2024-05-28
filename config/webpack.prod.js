const { merge } = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {GenerateSW} = require('workbox-webpack-plugin');
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
    // Makes some environment variables available in index.html.
    // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In production, it will be an empty string unless you specify "homepage"
    // in `package.json`, in which case it will be the pathname of that URL.
    // new InterpolateHtmlPlugin(env.raw),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
    // It is absolutely essential that NODE_ENV was set to production here.
    // Otherwise React will be compiled in the very slow development mode.
    /* UPDATE TO WEBPACK 4 : not needed in production mode
    new webpack.DefinePlugin(env.stringified),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebookincubator/create-react-app/issues/2376
        // Pending further investigation:
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false,
      },
      mangle: {
        safari10: true,
      },
      output: {
        comments: false,
        // Turned on because emoji and regex is not minified properly using default
        // https://github.com/facebookincubator/create-react-app/issues/2488
        ascii_only: true,
      },
      sourceMap: shouldUseSourceMap,
    }),
    */
    // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
    /*
    new ExtractTextPlugin({
      filename: cssFilename,
      }),
      */
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
      // Customize the generated service worker script.
      // runtimeCaching: [
      //   {
      //     urlPattern: new RegExp('^https://your-api-url.com/'),
      //     handler: 'NetworkFirst',
      //     options: {
      //       cacheName: 'api-cache',
      //       expiration: {
      //         maxEntries: 50,
      //         maxAgeSeconds: 5 * 60, // 5 minutes
      //       },
      //       cacheableResponse: {
      //         statuses: [0, 200],
      //       },
      //     },
      //   },
      // ],
    }),

    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/, // Ignore all files matching this pattern
      contextRegExp: /moment$/ // Only in the context of 'moment'
    })
    /*
    new SentryWebpackPlugin({
      include: '.',
      ignoreFile: '.sentrycliignore',
      ignore: ['node_modules', 'webpack.config.js', '/env.js$/'],
      rewrite: true,
      release: process.env.GIT_SHA,
    }),
    */
  ],
});