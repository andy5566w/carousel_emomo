const path = require("path");
module.exports = {
  entry: "./src/ts/App.ts",
  output: {
    filename: "carousel_emomo.js",
    path: path.resolve(__dirname),
  },
  devtool: "inline-source-map",
  module: {
    rules: [{ test: /\.ts$/, use: "ts-loader", exclude: /node_modules/ }],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
