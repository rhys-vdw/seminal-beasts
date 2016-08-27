var webpack = require('webpack');

var definePlugin = new webpack.DefinePlugin({
  'process.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
});

module.exports =  {
  entry: "./src/index.js",
  output: {
      path: __dirname,
      filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: require('./.babelrc.json')
      }, /*{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'standard'
      },*/ {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  //debug: true,
  devtool: 'source-map',
  plugins: [definePlugin]
}
