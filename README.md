# Joyshark(乐鲨云) 移动项目生成器模板

> 一个完整的移动项目生成器模板，使用 webpack 打包，包含了 `vue-router`、`vuex`、 `axios`等常用库，支持 ES7/JSX/CSS3/CSS Next/SASS/Less 等语法.

## 使用

这是一个基于 [vue-cli](https://github.com/vuejs/vue-cli)的生成器样板。**依赖 NodeJS v6.0 以上版本。**

1. 安装 `vue-cli`（如果你没有安装过的话）

```bash
$ npm install -g vue-cli
```

2. 创建项目，如下命令会在当前目录下创建一个新目录`my-project`

``` bash
$ vue-init --clone http://git.yidouinc.com:8181:front-end/generator-mobile my-project
```

启动的开发服务器默认使用`8200`端口. 如果`8200`端口已被占用自动将使用另一个未被占用的端口.

## UI 框架

使用 muse-ui 框架，常用组件请参考：[muse-ui 组件](http://www.muse-ui.org/#/layout)

## 此样板包含哪些特性？

- `npm run dev`: first-in-class development experience.
  - 使用Webpack + `vue-loader` 编译`*.vue`单位及组件.
  - 自动热更新（编辑代码无需主动刷新浏览器）
  - 保存即编译并即时显示编译错误
  - 文件保存时使用 ESLint 检查语法规范
  - Source maps

- `npm run build`: 生产环境打包.
  - 使用 [UglifyJS](https://github.com/mishoo/UglifyJS2) 压缩 JS 代码.
  - 使用 [html-minifier](https://github.com/kangax/html-minifier) 压缩 HTML 代码.
  - 使用 [cssnano](https://github.com/ben-eb/cssnano) 将所有组件中的 CSS 代码打包成一个文件.
  - 使用内容相关的 hash 自动重命名静态资源文件, 使得长效缓存成为可能.

## 项目结构

```html
{Project Root}
├─.babelrc
├─.editorconfig
├─.eslintrc
├─.gitignore
├─.npmrc
├─Makefile
├─README.md
├─package.json
├─postcss.config.js
├─tsconfig.json
├─tslint.json
├─types
|   ├─module-types.d.ts
|   └vue-extend.d.ts
├─test
|  ├─mock
├─src
|  ├─App.vue
|  ├─index.html
|  ├─index.js
|  ├─routes.js
|  ├─views
|  ├─utils
|  ├─styles
|  ├─store
|  ├─mixin
|  ├─directives
|  ├─components
|  ├─assets
├─config
|   ├─dev.runtime.js
|   └─prod.runtime.js
└─build
    ├─route-generator.js
    ├─vue-loader-config.js
    ├─webpack.config.js
    └─webpack.dll.js

```
