const path = require(`path`);
const webpack = require("webpack");

const config = {
  devtool: false,
  entry: [
    "./js/util.js",
    "./js/server.js",
    "./js/data.js",
    "./js/filter.js",
    "./js/preview.js",
    "./js/gallery.js",
    "./js/form.js",
    "./js/validation.js"
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname),
    iife: true,
  },
};

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    config.mode = "development";
    config.devtool = "source-map";
    config.devServer = {
      open: true,
      port: 3000,
    };
    config.plugins = [new webpack.HotModuleReplacementPlugin()];
  }

  return config;
};
