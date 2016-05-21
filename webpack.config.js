module.exports = {
  context: __dirname,
  entry: {
    jsx: "./app/index.jsx",
    html: "./app/index.html"
  },

  output: {
    path: __dirname + "/build",
    filename: "bundle.js"
  },
  module: {
    preLoaders: [
        //Eslint loader
      { test: /\.jsx?$/, exclude: /node_modules/, loader: "eslint-loader"}
    ],
    loaders: [
      { test: /\.html$/, loader: "file?name=[name].[ext]" },
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ["babel-loader"]},
      { test: /\.less$/, loader: "style!css!less" }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  eslint: {
    configFile: './.eslintrc'
  }
};
