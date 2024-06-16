const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.config");

/** @type {import("webpack".Configuration)} */
const prodConfig = {
  entry: {
    main: "./src/index.ts",
  },
  mode: "production",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    libraryTarget: 'commonjs2'
  }
};

module.exports = merge.merge(common, prodConfig);
