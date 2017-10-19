# Joyshark(乐鲨云) 移动项目生成器模板

> 一个完整的移动项目生成器模板，使用 webpack 打包，包含了 `vue-router`、`vuex`、 `axios`等常用库，支持 ES7/JSX/CSS3/CSS Next/SASS/Less 等语法.

## 使用

这是一个基于 [vue-cli](https://github.com/vuejs/vue-cli)的生成器样板。**需要安装 NodeJS v6.0以上本版本。**

``` bash
$ npm install -g vue-cli
$ vue init webpack my-project
$ cd my-project
$ npm install
$ npm run dev
```

启动的开发服务器默认使用`8200`端口. 如果`8200`端口已被占用自动将使用另一个未被占用的端口.

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