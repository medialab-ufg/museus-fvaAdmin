const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
  inject: 'body'
});

module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'assets')
  },
  plugins: {
    uglify: {
      mangle: false,
      compress: {
        global_defs: {
          DEBUG: false
        }
      }
    }
  },
  module: {
    loaders: [
      { 
        test: /\.jsx?$/, 
        loader: 'babel-loader', 
        exclude: /node_modules/,
      },
      { 
        test: /\.css$/, 
        loader: "style-loader!css-loader"
      }
    ],
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader"
          },
          {
            loader: "eslint-loader",
            options: {
              fix: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader'
      }
    ],
  },
  devtool: 'inline-source-map',
  plugins: [
    HtmlWebpackPluginConfig,
    new UglifyJSPlugin()
  ]
};
