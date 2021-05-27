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

// DEV SERVER
exports.devServer = () => ({
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    // watch html
    before: function (app, server, compiler) {
      server._watch("./src/*.html");
    },
    port: 8080, // or port: 3000
    //host: "0.0.0.0", // for network devices eg phone
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
              //options: {
              //publicPath: "/",
              //}, // for images?
            },
            "css-loader?url=false",
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
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: options,
      }),
    ],
  },
});

// LOAD IMAGES
exports.loadImages = ({ limit } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i, //SVG?
        type: "asset",
        //parser: { dataUrlCondition: { maxSize: limit } }, // TRy
      },
    ],
  },
});

// LOAD RESPONSIVE IMAGES
exports.loadResponsiveImages = () => ({
  module: {
    rules: [
      {
        test: /\.(jpe?g|png)$/i,
        loader: "responsive-loader",
        options: {
          // If you want to enable sharp support:
          // adapter: require('responsive-loader/sharp')
          sizes: [300, 600, 1200, 2000],
          placeholder: true,
          placeholderSize: 50,
          adapter: require("responsive-loader/sharp"),
          name: "[name].[hash].[ext]",
          outputPath: "images",
          esModule: false,
        },
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
  optimization: {
    minimizer: [new TerserPlugin()],
  },
});

// DEVTOOLS
exports.generateSourceMaps = ({ type }) => ({
  devtool: type,
});

// CLEAN DIST FOLDER
exports.clean = () => ({
  plugins: [new CleanWebpackPlugin()],
});

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
