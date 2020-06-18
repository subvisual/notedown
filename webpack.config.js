const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ErrorOverlayPlugin = require("error-overlay-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";

const clientPlugins = [
  new HtmlWebpackPlugin({
    title: "NoteDown",
    template: "src/client/index.html",
  }),
];

if (isDev) clientPlugins.push(new ErrorOverlayPlugin());

module.exports = [
  {
    name: "server",
    entry: "./src/server/index.ts",
    mode: process.env.NODE_ENV || "development",
    target: "electron-main",
    stats: "errors-only",
    node: false,
    devtool:
      process.env.NODE_ENV === "production"
        ? "source-map"
        : "inline-source-map",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          exclude: /node_modules/,
          options: {
            onlyCompileBundledFiles: true,
          },
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "build/server/"),
    },
    optimization: isDev
      ? {}
      : {
          minimize: true,
          minimizer: [new TerserPlugin()],
        },
  },
  {
    name: "client",
    entry: "./src/client/index.tsx",
    devtool: isDev ? "inline-source-map" : "source-map",
    mode: process.env.NODE_ENV || "development",
    target: "electron-renderer",
    devServer: {
      contentBase: path.join(__dirname, "build/client"),
      stats: "errors-only",
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          exclude: /node_modules/,
          options: {
            onlyCompileBundledFiles: true,
          },
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: ["file-loader"],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: ["file-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "build/client/"),
    },
    plugins: clientPlugins,
    optimization: isDev
      ? {}
      : {
          minimize: true,
          minimizer: [new TerserPlugin()],
        },
  },
];
