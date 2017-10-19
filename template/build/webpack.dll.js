const webpack = require('webpack')
const path = require('path')
const os = require('os')
const UglifyJsParallelPlugin = require('webpack-uglify-parallel')
const dllPath = path.resolve(__dirname, '../dll')

let config = {
  devtool: '#source-map',
  entry: {
    vendor: [
      'babel-polyfill',
      'vue',
      'vuex',
      'muse-ui',
      'fastclick',
      'vue-router',
      'qs',
      'shark-components',
      'moment',
      'vue2-filters',
      'async-validator',
      'echarts',
      'keycode',
      'lodash',
      'util-deprecate',
      'vue-infinite-loading',
      'vueg',
      'vuex-localstorage'
    ]
  },
  output: {
    publicPath: '/',
    path: dllPath,
    filename: '[name].js',

    /**
     * output.library
     * 将会定义为 window.${output.library}
     * 在这次的例子中，将会定义为`window.vendor_library`
     */
    library: 'vendor'
  },
  resolve: {},

  plugins: [
    new webpack.DllPlugin({
      context: __dirname,

      /**
       * path
       * 定义 manifest 文件生成的位置
       * [name]的部分由entry的名字替换
       */
      path: path.join(dllPath, 'manifest.json'),

      /**
       * name
       * dll bundle 输出到那个全局变量上
       * 和 output.library 一样即可。
       */
      name: 'vendor'
    }),

    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    // new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: false,
    //   compress: {
    //     warnings: false
    //   }
    // }),

    new UglifyJsParallelPlugin({
      workers: os.cpus().length,
      mangle: true,
      compressor: {
        warnings: false,
        'drop_console': true,
        'drop_debugger': true
      }
    }),

    new webpack.NamedModulesPlugin()
  ]
}

module.exports = config
