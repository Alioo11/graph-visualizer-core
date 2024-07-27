const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


/** @type {import("webpack".Configuration)} */
const baseConfig = {
  output: {
    filename: "js/[name]-[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        type: "asset/resource",
        generator: {
          filename: `img/[name][ext]`,
        },
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
  resolve: {
    alias: {
      "@models": path.resolve(__dirname, "./src/models"),
      "@scss": path.resolve(__dirname, "./src/scss"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@_types": path.resolve(__dirname, "./src/types"),
    },
    extensions: [".ts", ".js"],
  },
};

module.exports = baseConfig;
