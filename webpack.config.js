const path = require("path");
const autoprefixer = require("autoprefixer");

/** @type {import("webpack".Configuration)} */
const baseConfig = {
  entry: {
    main: "./src/index.ts",
  },
  mode: "development",
  output: {
    filename: "js/[name]-[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [autoprefixer],
              },
            },
          },
          {
            loader: "sass-loader",
          },
        ],
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
  resolve: {
    alias: {
      '@models': path.resolve(__dirname, './src/models'),
      '@scss': path.resolve(__dirname, './src/scss'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
    extensions: [".tsx", ".ts", ".js"],
  },
};

module.exports = baseConfig;
