const path = require('path');
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  devtool: 'inline-source-map',

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    watchContentBase: true,
    progress: true,
    open: true,
    historyApiFallback: true,
    hot: true,
  },

  mode: 'development',

  target: 'web',

  module: {
    rules: [
      {
        test: /\.(sass|scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|webp|svg)$/,
        use: [
          'file-loader',
        ],
      },
    ],
  },
});