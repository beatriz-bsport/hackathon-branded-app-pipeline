const { rspack } = require('@rspack/core');
const { merge } = require('webpack-merge');

const common = require('./rspack.common.js');
const paths = require('./paths');
const getClientEnvironment = require('./env');

const publicUrl = '';
const env = getClientEnvironment(publicUrl);

const publicPath = '/';

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    historyApiFallback: true,
    allowedHosts: 'all',
    port: 3000,
    hot: true,
    open: true,
    compress: true,
    client: {
      overlay: {
        errors: false,
        warnings: false,
      },
    },
    static: {
      directory: paths.appPublic,
      publicPath,
    },
  },
  output: {
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath,
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      inject: true,
      template: paths.appHtml,
      templateParameters: env.raw,
    }),
    new rspack.HotModuleReplacementPlugin(),
    // Disabling ESLintPlugin for now, it is usefull but does take a lot of time and ressources on first start
    // new ESLintPlugin({
    //   extensions: ['.js', '.jsx', '.ts', '.tsx'],
    //   emitWarning: true,
    //   failOnWarning: false,
    //   failOnError: false,
    // }),
  ],
});
