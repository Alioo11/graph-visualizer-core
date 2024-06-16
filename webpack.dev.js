const path = require("path");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const common = require("./webpack.config");

/** @type {import("webpack".Configuration)} */
const devConfig = {
  entry: {
    main: "./src/main.ts",
  },
  output: {
    filename: "js/[name]-[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devServer: {
    port: 3030,
    compress: true,
    static: [path.join(__dirname, "public")],
  },
  plugins: [new HtmlWebpackPlugin({ template: "./public/index.html" })],
};

module.exports = merge.merge(common, devConfig);
