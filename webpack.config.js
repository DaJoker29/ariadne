const debug = process.env.NODE_ENV !== 'production';
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  client: path.join(__dirname, 'client'),
  scripts: path.join(__dirname, 'client/scripts'),
  build: path.join(__dirname, 'build'),
};

module.exports = {
  devtool: debug ? 'inline-sourcemap' : null,
  // devServer: {
  //   contentBase: 'build',
  //   historyApiFallback: true,
  //   hot: true,
  //   inline: true,
  //   progress: true,
  //   stats: 'errors-only',
  //   host: process.env.HOST || 'localhost',
  //   port: process.env.PORT || 3000
  // },
  entry: [
    'webpack-hot-middleware/client?reload=true',
    path.join(PATHS.client, 'main.jsx'),
  ],
  eslint: {
    configFile: '.eslintrc',
    fix: true,
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel?cacheDirectory',
        include: PATHS.client,
      },
    ],
  },
  output: {
    path: PATHS.build,
    filename: '[name].js',
    publicPath: '/',
  },
  plugins: debug ? [
    new HtmlWebpackPlugin({
      template: 'client/views/dashboard.html',
      inject: 'body',
      filename: 'index.html',
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ] : [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      sourcemap: false,
    }),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
};
