var path = require("path");
var webpack = require("webpack");
module.exports = {
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "app.bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        loader: "babel-loader",
      },
    ],
  },
  stats: {
    colors: true,
  },
  devtool: "source-map",
};
