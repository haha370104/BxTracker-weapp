'use strict'
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const env = process.env.NODE_ENV

const config = {
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loaders: ['babel', 'awesome-typescript'],
        exclude: /node_modules/
      }
    ]
  },
  output: {
    library: 'LibraryName',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.ts', '.tsx'],
  },
  externals: {}
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
