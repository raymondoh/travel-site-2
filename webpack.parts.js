const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

// PURGE CSS
const glob = require("glob");
const PurgeCSSPlugin = require("purgecss-webpack-plugin");
const ALL_FILES = glob.sync(path.join(__dirname, "src/*.js"));

// FOR JS
const APP_SOURCE = path.join(__dirname, "src");

// DEV SERVER
exports.devServer = () => ({
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    // watch html
    before: function (app, server, compiler) {
      server._watch("./src/*.html");
    },
    port: 8080,
    //host: "0.0.0.0",
    hot: true,
    open: true,
    stats: "errors-only",
    compress: true,
    overlay: true,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
});

// HTML PAGE
exports.page = () => ({
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      title: "Custom template",
      inject: true,
      hash: true,
    }),
  ],
});

// SCSS
exports.extractSCSS = ({ options = {}, loaders = [] } = {}) => {
  return {
    module: {
      rules: [
        {
          test: /\.s?css$/,
          use: [
            { loader: MiniCssExtractPlugin.loader, options },
            "css-loader",
            "postcss-loader",
            "sass-loader",
          ].concat(loaders),
          sideEffects: true,
        },
      ],
    },
    plugins: [new MiniCssExtractPlugin({ filename: "styles/[name].css" })],
  };
};

// ELIMINATE UNUSED CSS
exports.eliminateUnusedCSS = () => ({
  plugins: [
    new PurgeCSSPlugin({
      paths: ALL_FILES,
      extractors: [
        {
          extractor: (content) =>
            content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
          extensions: ["html"],
        },
      ],
    }),
  ],
});

// MINIMISE CSS
exports.minifyCSS = ({ options }) => ({
  optimization: {
    minimizer: [new CssMinimizerPlugin({ minimizerOptions: options })],
  },
});

// LOAD IMAGES
exports.loadImages = ({ limit } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        type: "asset",
        parser: { dataUrlCondition: { maxSize: limit } },
      },
    ],
  },
});

// LOAD JS
exports.loadJavaScript = () => ({
  module: {
    rules: [
      // Consider extracting include as a parameter
      { test: /\.js$/, include: APP_SOURCE, use: "babel-loader" },
    ],
  },
});

// MINIFY JS
exports.minifyJavaScript = () => ({
  optimization: { minimizer: [new TerserPlugin()] },
});

// DEVTOOLS
exports.generateSourceMaps = ({ type }) => ({ devtool: type });

// CLEAN DIST FOLDER
exports.clean = () => ({ plugins: [new CleanWebpackPlugin()] });
