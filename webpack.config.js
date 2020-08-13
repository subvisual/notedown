const fs = require("fs");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ErrorOverlayPlugin = require("error-overlay-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";

const clientPlugins = [
  new HtmlWebpackPlugin({
    title: "NoteDown",
    template: "src/client/index.html"
  })
];

if (isDev) clientPlugins.push(new ErrorOverlayPlugin());

function createAliasesToFolder(originPath) {
  return fs
    .readdirSync(originPath, { withFileTypes: true })
    .filter(found => found.isDirectory())
    .reduce(
      (memo, folder) => ({
        ...memo,
        [folder.name]: path.join(originPath, folder.name)
      }),
      {}
    );
}

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
          test: /\.sql$/,
          loader: "raw-loader"
        },
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          exclude: /node_modules/,
          options: {
            onlyCompileBundledFiles: true
          }
        }
      ]
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"]
    },
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "build/server/")
    },
    externals: {
      sqlite3: "commonjs sqlite3"
    },
    optimization: isDev
      ? {}
      : {
          minimize: true,
          minimizer: [new TerserPlugin()]
        }
  },
  {
    name: "client",
    entry: "./src/client/index.tsx",
    devtool: isDev ? "inline-source-map" : "source-map",
    mode: process.env.NODE_ENV || "development",
    target: "web",
    devServer: {
      contentBase: path.join(__dirname, "build/client"),
      stats: "errors-only"
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          exclude: /node_modules/,
          options: {
            onlyCompileBundledFiles: true
          }
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: ["file-loader"]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: ["file-loader"]
        },
        {
          test: /\.sql$/,
          use: "raw-loader"
        }
      ]
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: {
        models: path.resolve(__dirname, "src/models"),
        ...createAliasesToFolder(path.resolve(__dirname, "src/client"))
      }
    },
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "build/client/")
    },
    externals: {
      sqlite3: "commonjs sqlite3",
      electron: "commonjs electron",
      fs: "commonjs fs"
    },
    plugins: clientPlugins,
    optimization: isDev
      ? {}
      : {
          minimize: true,
          minimizer: [new TerserPlugin()]
        }
  }
];
