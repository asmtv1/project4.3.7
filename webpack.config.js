const path = require("path");

module.exports = {
  mode: "production", // Установите 'development' для режима разработки или 'production' для продакшена
  entry: "./index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
