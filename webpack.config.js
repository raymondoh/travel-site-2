const path = require("path");
const { mode } = require("webpack-nano/argv");
const { merge } = require("webpack-merge");
const parts = require("./webpack.parts");

const commonConfig = merge([
  { output: { path: path.resolve(process.cwd(), "dist") } },
  parts.clean(),
  { entry: ["./src"] },
  parts.page(),
  parts.extractSCSS(),
  parts.loadImages({ limit: 15000 }),
  parts.loadJavaScript(), // move to production?
]);

const productionConfig = merge([
  parts.minifyJavaScript(),
  parts.minifyCSS({ options: { preset: ["default"] } }),
  parts.eliminateUnusedCSS(),
  parts.generateSourceMaps({ type: "source-map" }),
  //{ optimization: { splitChunks: { chunks: "all" } } },

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
  parts.generateSourceMaps({ type: "eval-cheap-source-map" }),
]);

const getConfig = (mode) => {
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

// module.exports = {
//   entry: "./src/index.js",
//   output: {
//     path: path.resolve(__dirname, "dist/assets"),
//     filename: "index_bundle.js",
//   },
//   mode: "production",
// };
