const fs = require('fs')
const path = require('path')
const klawSync = require('klaw-sync')
const watcher = require('chokidar')

function updateRoutes(dir) {
  const filter = item => path.extname(item.path) === '.vue'
  const paths = klawSync(dir, { filter: filter }).map((p) => {
    let filepath = p.path.replace(`${dir}/`, '')

    if (filepath.match(/\/index\.vue$/)) {
      filepath = filepath.replace(/\/index\.vue$/, '')
    } else {
      filepath = filepath.replace(/\.vue$/, '')
    }

    return filepath
  })
  let jsonFile = path.resolve(dir, '../router/patterns.js')
  let template = `/**
 * 【警告！！！这是一个自动生成的文件，任何更改都会被 webpack 覆写】
 * 此文件在 ./build/webpack.config.js 中调用 ‘./build/route-generator.js’ 自动生成
 * 
 * 自动生成简单的路由规则，仅包含 path，目的是为了简化开发流程，
 * 在 views 目录下创建*.vue文件后立即就能访问，无须手动配置路由映射表
 * 如果需要复杂的路由配置，请在./src/routes.js中按照 vue-router 官方文档配置，
 * ./src/routes.js中的同名 path 会覆盖此文件中的 path
 */

/* eslint quotes:off */
export default ${JSON.stringify(paths, 2, 2)}
`

  fs.writeFileSync(jsonFile, template);
}

const cache = () => {
  let dir = path.resolve(__dirname, '../src/views')
  let timer

  updateRoutes(dir);
  watcher.watch(dir + '/**/*.vue')
    .on('all', (event, path) => {
      if (event !== 'changed') {
        // console.log(event, path);
        clearTimeout(timer);

        timer = setTimeout(()=>{
          updateRoutes(dir);
        }, 100);
      }
    });

  console.log('Watching for router generator!');
}

cache();
module.exports = exports = cache;
