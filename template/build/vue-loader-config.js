const fs = require('fs')
const path = require('path')
const env = require('yargs').argv.env || {}
const isProduction = !env.dev || process.env.NODE_ENV === 'production'
const postcssConfig = require('../postcss.config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

/**
 * 从给定文件中读取 Less 变量
 * @param file
 * @return {{}}
 */
exports.getLessVariables = function getLessVariables(file) {
  let variables = {}

  if (fs.existsSync(file)) {
    let themeContent = fs.readFileSync(file, 'utf-8')

    themeContent.split('\n').forEach(function(item) {
      let pair, key, value

      if (item.indexOf('//') > -1 || item.indexOf('/*') > -1) {
        return
      }
      pair = item.split(':')

      if (pair.length < 2) return;

      key = pair[0].replace('\r', '').replace('@', '')

      if (!key) return;
      value = pair[1].replace(';', '').replace('\r', '').replace(/^\s+|\s+$/g, '')

      variables[key] = value
    })
  }

  return variables
}

exports.cssLoaders = function (options) {
  let cssLoader
  let lessVarsPath
  let lessVars
  let museUiThemePath
  let resultLoaders

  options = options || {}
  cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: isProduction,
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    let loaders = [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  lessVarsPath = '../src/styles/vars.less'
  lessVars = exports.getLessVariables(path.resolve(__dirname, lessVarsPath))
  museUiThemePath = path.join(
    __dirname,
    '../node_modules',
    'muse-ui',
    'src/styles/themes/variables/default.less'
  )
  lessVars.museUiTheme = `'${museUiThemePath}'`

  resultLoaders = {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less', {
      globalVars: lessVars
    }),
    sass: generateLoaders('sass', {indentedSyntax: true}),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus'),
    jsx: ['babel-loader']
  }

  return resultLoaders
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  let output = []
  let loaders = exports.cssLoaders(options)

  for (let extension in loaders) {
    let loader = loaders[extension]

    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader,
      exclude: [/theme|var.less/, /themes/]
    })
  }
  return output
}

exports.loaders = {
  sourceMap: !isProduction,
  loaders: exports.cssLoaders({
    sourceMap: !isProduction,
    extract: isProduction
  }),
  postcss: postcssConfig.plugins,
  esModule: true
}
