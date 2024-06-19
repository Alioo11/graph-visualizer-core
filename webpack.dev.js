const path = require("path");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const common = require("./webpack.config");

/** @type {import("webpack".Configuration)} */
const devConfig = {
  mode:"development",
  entry: "./src/main.ts",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    port: 3030,
    compress: true,
  },
  plugins: [new HtmlWebpackPlugin({ template: "./public/index.html" })],
};

module.exports = merge.merge(common, devConfig);
