const resolve = require('path').resolve
const fork = require('child_process').spawn
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const vueLoaderConfig = require('./vue-loader-config.js')
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const SRC = 'src'

const htmlMinifyOpt = {
  collapseWhitespace: false,
  minifyCSS: true,
  minifyJS: true,
  quoteCharacter: '"',
  removeComments: false,
  removeEmptyAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  removeTagWhitespace: true
}
const lessVarsPath = resolve(__dirname, `../${SRC}/styles/vars.less`)
const lessVars = vueLoaderConfig.getLessVariables(lessVarsPath)

// 自动更新路由规则
function foreverRun(nodefile) {
  let childProcess = fork('node', [nodefile]);

  childProcess.stdout.on('data', function (data) {
    console.log(data.toString());
  });
  childProcess.stderr.on('data', function (data) {
    console.log(data.toString());
  });
  // 监测退出事件，删除原进程并重启新进程
  childProcess.on('exit', function (code) {
    console.log('child process exited with code: ' + code + ', and will start latter automatically.');
    // delete(routerProcess);
    // foreverRun(nodefile)
  });

  return childProcess;
}

let routerProcess = foreverRun('./build/route-generator.js');

process.on('exit', routerProcess.kill)

module.exports = (options = {}) => {
  return {
    entry: {
      index: ['babel-polyfill', `./${SRC}/index.js`]
    },

    output: {
      path: resolve(__dirname, '../dist'),
      filename: options.dev ? 'assets/js/[name].js' : 'assets/js/[name].[chunkhash:8].js',
      chunkFilename: 'assets/js/[name].[chunkhash:8].js',
      publicPath: '/'
    },

    resolve: {
      extensions: ['.ts', '.js', '.vue'],
      alias: {
        'config': resolve(__dirname, '../config'),
        'src': resolve(__dirname, `../${SRC}`),
        'assets': resolve(__dirname, `../${SRC}/assets`),
        'decorators': resolve(__dirname, `../${SRC}/decorators`),
        'components': resolve(__dirname, `../${SRC}/components`),
        'directives': resolve(__dirname, `../${SRC}/directives`),
        'mixins': resolve(__dirname, `../${SRC}/mixins`),
        'filters': resolve(__dirname, `../${SRC}/filters`),
        'theme': resolve(__dirname, '../theme'),
        'views': resolve(__dirname, `../${SRC}/views`),
        'styles': resolve(__dirname, `../${SRC}/styles`),
        'utils': resolve(__dirname, `../${SRC}/utils`),
        'store': resolve(__dirname, `../${SRC}/store`),
        'router': resolve(__dirname, `../${SRC}/router`),
        'tween': '@tweenjs/tween.js'
      }
    },

    module: {
      rules: [
        {
          test: /\.vue$/,
          use: [
            {
              loader: 'vue-loader',
              options: vueLoaderConfig.loaders
            }
          ]
        },

        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          enforce: 'pre',
          loader: 'tslint-loader'
        },

        {
          test: /\.tsx?$/,
          // exclude: /node_modules|vue\/src/,
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/]
          }
        },

        {
          test: /\.js$/,
          exclude: /node_modules/,
          enforce: 'pre',
          loader: 'eslint-loader'
        },

        {
          test: /\.jsx?$/,
          use: ['babel-loader'],
          exclude: /node_modules/
        },

        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader']
        },

        {
          test: /\.(scss|sass)$/,
          use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
        },

        {
          test: /\.less$/,
          use: ['style-loader', 'css-loader', 'postcss-loader',
            {
              loader: 'less-loader',
              options: {
                globalVars: Object.assign({}, lessVars),
                sourceMap: options.dev
              }
            }
          ]
        },

        {
          test: /\.html$/,
          loader: 'vue-template-loader',
          include: /src\/views/,
          exclude: ['../src/index.html'],
          options: {
            transformToRequire: {
              // The key should be an element name
              // The value should be an attribute name or an array of attribute names
              img: 'src'
            },
            scoped: true
          }
        },

        {
          test: /\.(png|jpg|jpeg|gif|svg|svgz)(\?.+)?$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'assets/images/[name].[hash:8].[ext]'
            }
          }]
        },

        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          use: [{
            loader: 'url-loader',
            options: {
              name: 'assets/fonts/[name].[hash:8].[ext]'
            }
          }]
        },

        {
          test: /\.(mp3|mp4|wav|ogg)(\?.*)?$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: 'assets/media/[hash:8].[ext]'
            }
          }]
        }

      ]
    },

    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest'],
        filename: 'assets/js/[name].[hash:8].js',
        children: true,

      }),

      new webpack.optimize.ModuleConcatenationPlugin(),

      new ExtractTextPlugin({
        filename: 'assets/css/[name].[chunkhash:8].css',
        allChunks: true
      }),

      new HtmlWebpackPlugin({
        title: '',
        inject: true,
        template: 'src/index.html',
        hash: false,
        minify: htmlMinifyOpt
      }),

      new webpack.DefinePlugin({
        'process.env.NODE_ENV': options.dev ? '"development"' : '"production"'
      }),

      new webpack.ProvidePlugin({
        CONFIG: 'config/' + (options.dev ? 'dev.runtime.js' : 'prod.runtime.js')
      }),

      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      new AddAssetHtmlPlugin({
        filepath: require.resolve('../dll/vendor.js'),
        outputPath: 'assets/js/',
        publicPath: '/assets/js/',
        includeSourcemap: false,
        hash: true
      }),

      new webpack.DllReferencePlugin({
        context: __dirname,

        /**
         * 在这里引入 manifest 文件
         */
        manifest: require('../dll/manifest.json')
      }),

      new webpack.optimize.OccurrenceOrderPlugin(),
      new DuplicatePackageCheckerPlugin(),
      new webpack.NamedModulesPlugin()
    ],

    devServer: {
      host: '0.0.0.0',
      port: 8205,
      proxy: {
        '/api/*': {
          target: 'http://127.0.0.1:2224',
          pathRewrite: {'^/api': '/'},
          secure: false
        }
      },
      disableHostCheck: true,
      historyApiFallback: {
        index: '/'
      }
    },

    devtool: options.dev ? '#eval-source-map' : '#source-map'
  }
}
