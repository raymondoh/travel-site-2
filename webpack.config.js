const path = require("path");
const { mode } = require("webpack-nano/argv");
const { merge } = require("webpack-merge");
const parts = require("./webpack.parts");

const commonConfig = merge([
  {
    entry: {
      main: path.resolve(__dirname, "./src/index.js"),
    },
    output: {
      //path: path.resolve(__dirname, "dist"), // works
      //path: path.resolve(__dirname, "./dist"),// works
      path: path.resolve(process.cwd(), "dist"),
      filename: "scripts/[name].[chunkhash].bundle.js",
      publicPath: "", // or comment out
    },

    // entry: {
    //   index: {
    //     import: "./src/index.js",
    //     dependOn: "shared",
    //   },
    //   another: {
    //     import: "./src/scripts/modules/RevealOnScroll.js",
    //     dependOn: "shared",
    //   },
    //   shared: "lodash",
    // },
    // output: {
    //   filename: "scripts/[name].bundle.js",
    //   path: path.resolve(__dirname, "dist"),
    //   clean: true,
    // },
    // optimization: {
    //   splitChunks: {
    //     chunks: "all",
    //   },
    // },
  },
  parts.clean(),
  parts.page(),
  parts.loadJavaScript(), // move to production?
  parts.extractSCSS(),
  //parts.loadImages({ limit: 150000 }),// TRY
  parts.loadImages(),
  parts.loadResponsiveImages(),
  parts.copy(), //
  //parts.loadHtml(),
  //parts.loadSvg(),
]);

const productionConfig = merge([
  parts.minifyJavaScript(),
  parts.minifyCSS({ options: { preset: ["default"] } }),
  //parts.generateSourceMaps({ type: "source-map" }),
  //parts.eliminateUnusedCSS(), //PROBLEM

  //ORIGINAL
  { optimization: { splitChunks: { chunks: "all" } } },
  {
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "initial",
          },
        },
      },
    },
  },
]);

const developmentConfig = merge([
  parts.devServer(),
  //parts.generateSourceMaps({ type: "eval-cheap-source-map" })
  parts.generateSourceMaps({ type: "inline-source-map" }),
]);

const getConfig = mode => {
  switch (mode) {
    case "production":
      return merge(commonConfig, productionConfig, { mode });
    case "development":
      return merge(commonConfig, developmentConfig, { mode });
    default:
      throw new Error(`Trying to use an unknown mode, ${mode}`);
  }
};
module.exports = getConfig(mode);
