/* eslint strict:0 */

'use strict';

const path = require('path');
const fs = require('fs');
if (!fs.existsSync('node_modules/domino-compiler')) {
  if (!fs.existsSync('node_modules')) fs.mkdirSync('node_modules');
  fs.symlinkSync('../', './node_modules/domino-compiler', 'dir');
}

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.json'],
  },
  entry: {
    "demo": path.join(__dirname, './demo/index'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: '#source-map',
  devServer: {
    disableHostCheck: true,
    hot: false,
  },
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.css$/, use: [ "style-loader", "css-loader" ] },
      { test: /\.less$/, use: [ "style-loader", "css-loader", { loader: "less-loader", options: { javascriptEnabled: true } } ] },
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      // { test: /\.json$/, loader: "json-loader" },
    ],
  },
  plugins: [
  ],
};
