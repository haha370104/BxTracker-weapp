'use strict'
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const env = process.env.NODE_ENV

const config = {
  module: {
    rules: [
      {test: /\.ts$/, loader: 'ts-loader'}
    ]
  },
  output: {
    path: __dirname + "/dist",
    filename: "BxTracker-weapp.js"
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [],
}

if (env === 'production') {
  config.plugins.push(
    new UglifyJSPlugin({
      uglifyOptions: {
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      }
    })
  )
  config.plugins.push(new webpack.optimize.DedupePlugin())
}

module.exports = config
