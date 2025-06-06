const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const common = require('./webpack.common.js');
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
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      templateParameters: env.raw,
    }),
    new webpack.HotModuleReplacementPlugin(),
    // Disabling ESLintPlugin for now, it is usefull but does take a lot of time and ressources on first start
    // new ESLintPlugin({
    //   extensions: ['.js', '.jsx', '.ts', '.tsx'],
    //   emitWarning: true,
    //   failOnWarning: false,
    //   failOnError: false,
    // }),
  ],
});
