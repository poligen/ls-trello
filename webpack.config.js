const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');

const parts = require('./webpack.parts');

const PATHS = {
  app: path.join(__dirname, 'public/index.js'),
  build: path.join(__dirname, 'build'),
};
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


const commonConfig = merge([
  {
    entry: {
      vendor: ['backbone', 'underscore', 'jquery','jquery-ui', 'backbone.marionette','backbone-relational'],
      app: ['webpack-hot-middleware/client?reload=true', PATHS.app],
      }
    ,
    output: {
      devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
      path: PATHS.build,
      filename: '[name].js',
      publicPath: '/',

    },
    resolve: {
      alias: {
        handlebars: 'handlebars/dist/handlebars.min.js',
      },
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new ExtractTextPlugin('application.css'),
      new webpack.ProvidePlugin({
        $: 'jquery',
        "jQuery": 'jquery',
        "window.jQuery":'jquery',
        _: 'underscore',
        Bb: 'backbone',
        Mn: 'backbone.marionette',
        Handlebars: 'handlebars',
      })
    ],
  },
  parts.loadCSS(),
  parts.loadJSON(),
  parts.loadHandlebars(),
  parts.loadImages(),
  parts.generateSourceMaps({type: 'cheap-module-source-map'}),
  parts.extractBundles([
    {
      name: 'vendor',
    },
  ]),
]);

const productionConfig = merge([
  {
    entry: {
      app: PATHS.app,
    }
    ,
    output: {
      path: PATHS.build,
      filename: '[name].js',
      publicPath: '/',

    },
    performance: {
      hints: 'warning', // 'error' or false are valid too
      maxEntrypointSize: 100000, // in bytes
      maxAssetSize: 450000, // in bytes
    },
  },
  // parts.loadImages({
  //   options: {
  //     limit: 15000,
  //     name: '[name].[ext]',
  //   },
  // }),

  parts.generateSourceMaps({type: 'source-map'}),
  parts.clean(PATHS.build),
]);

module.exports = (env) => {
  if (env === 'production') {
    return merge(commonConfig, productionConfig);
  }
  return merge(commonConfig);
};
