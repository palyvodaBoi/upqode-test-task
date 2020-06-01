const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebPackPlugin = require( 'html-webpack-plugin' );

module.exports = {
  entry: './js/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },

  mode: 'development',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },

      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true }
          }, {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer'), require('postcss-import'), require('cssnano')]
            }
          }, {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ]
      },

      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: "file-loader",

            options: {
              name: '[name].[ext]',
              outputPath: 'images'
            }
          }
        ]
      },

      {
        test: /\.(woff|woff2|ttf|otf|eot)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: 'fonts'
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "bundle.css"
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new HtmlWebPackPlugin({
      inject: 'body',
      template: './index.html'
    })
  ]
};
