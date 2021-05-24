const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSVGPlugin = require("html-webpack-inline-svg-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

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
      title: "Webpack boilerplate",
      template: path.resolve(__dirname, "./src/template.html"),
      //template: "./src/template.html",
      filename: "index.html",
      inject: true,
      hash: true,
    }),
  ],
});

// COPY FILES
exports.copy = () => ({
  plugins: [
    // Copies files from target to destination folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "./src/images"),
          to: "images",
          globOptions: {
            ignore: ["*.DS_Store"],
          },
          noErrorOnMissing: true,
        },
      ],
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
            {
              loader: MiniCssExtractPlugin.loader,
              options: { publicPath: "/" },
            },
            //"css-loader?url=false",
            "css-loader",
            "postcss-loader",
            "sass-loader",
          ].concat(loaders),
          sideEffects: true,
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "styles/[name].css",
      }),
    ],
  };
};

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
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: "asset",
        //parser: { dataUrlCondition: { maxSize: limit } },
      },
    ],
  },
});

// LOAD JS
exports.loadJavaScript = () => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
        },
      },
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

// ELIMINATE UNUSED CSS
// exports.eliminateUnusedCSS = () => ({
//   plugins: [
//     new PurgeCSSPlugin({
//       paths: ALL_FILES,
//       extractors: [
//         {
//           extractor: (content) =>
//             content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
//           extensions: ["html"],
//         },
//       ],
//     }),
//   ],
// });
