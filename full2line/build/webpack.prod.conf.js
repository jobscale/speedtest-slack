const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = utils.getCommit().then(commit => {
  let title = 'FULL-2WAY';
  const version = utils.getVersion();
  const env = config.build.env;
  const plugins = [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env,
    }),
  ];
  let minify;
  if (!process.env.FAST) {
    title += '-fast';
    plugins.push(
    // UglifyJs do not support ES6+, you can also use babel-minify for better treeshaking: https://github.com/babel/minify
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      sourceMap: true,
    }));
    minify = {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      // more options:
      // https://github.com/kangax/html-minifier#options-quick-reference
    };
  }
  plugins.push(
  // extract css into its own file
  new ExtractTextPlugin({
    filename: utils.assetsPath('css/[name].[contenthash].css'),
  }));
  plugins.push(
  // Compress extracted CSS. We are using this plugin so that possible
  // duplicated CSS from different components can be deduped.
  new OptimizeCSSPlugin({
    cssProcessorOptions: {
      safe: true,
    },
  }));
  plugins.push(
  // generate dist index.html with correct asset hash for caching.
  // you can customize output by editing /index.html
  // see https://github.com/ampedandwired/html-webpack-plugin
  new HtmlWebpackPlugin({
    filename: config.build.index,
    template: 'src/index.html',
    inject: true,
    minify,
    // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    chunksSortMode: 'dependency',
    title,
    version,
    commit,
    cordova: '<script src="cordova.js"></script>',
  }));
  plugins.push(
  // keep module.id stable when vender modules does not change
  new webpack.HashedModuleIdsPlugin());
  plugins.push(
  // split vendor js into its own file
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks(module) {
      // any required modules inside node_modules are extracted to vendor
      return (
      module.resource &&
      /\.js$/.test(module.resource) &&
      module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
      );
    },
  }));
  plugins.push(
  // extract webpack runtime and module manifest to its own file in order to
  // prevent vendor hash from being updated whenever app bundle is updated
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    chunks: ['vendor'],
  }));
  plugins.push(
  // copy custom static assets
  new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, '../static'),
      to: config.build.assetsSubDirectory,
      ignore: ['.*'],
    },
  ]));
  const webpackConfig = merge(baseWebpackConfig, {
    watch: process.env.WEBPACK_WATCH === 'true',
    module: {
      rules: utils.styleLoaders({
        sourceMap: config.build.productionSourceMap,
        extract: true,
      }),
    },
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    output: {
      path: config.build.assetsRoot,
      filename: utils.assetsPath('js/[name].[chunkhash].js'),
      chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'),
    },
    plugins,
  });

  if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin');

    webpackConfig.plugins.push(new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
      `\\.(${
      config.build.productionGzipExtensions.join('|')
      })$`,
      ),
      threshold: 10240,
      minRatio: 0.8,
    }));
  }

  if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
  }

  return webpackConfig;
});
