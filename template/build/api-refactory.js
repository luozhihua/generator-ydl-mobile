const fs = require('fs')
const path = require('path')
const klawSync = require('klaw-sync')
const dir = path.resolve(__dirname, '../src/components')
const apis = require('../../../mars-app/src/scripts/_apis/dev')

function filter(item) {
  return path.extname(item.path) === '.vue'
}

/**
 * 替换 APIS.xxx
 * @param file
 */
const PATERNERS = {
  'apis': {
    rule: /APIS\.(\w+)/g,
    exec (a, b) {
      console.log(a, ' ==> ', apis[b])
      return `'${apis[b]}'`
    }
  },

  'query': {
    rule: /this\.\$query/g,
    exec() {
      return 'this.$route.query'
    }
  },

  'router': {
    rule: /this\.\$page\.show/g,
    exec() {
      return 'this.$router.push'
    }
  }
}

let paterner = PATERNERS.apis

function replace(file) {
  let content = fs.readFileSync(file, 'utf8')

  content = content.replace(paterner.rule, paterner.exec)

  fs.writeFileSync(file, content)
}

klawSync(dir, { filter: filter }).map((file) => {
  //console.log(file.path)
  replace(file.path)
})
