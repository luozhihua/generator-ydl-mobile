const fs = require('fs')

let less = fs.readFileSync('./style.less', 'utf-8')
let regexp = /([\d\.]+)rem/gi

less = less.replace(regexp, function (a) {
  // console.log('replace', a)
  return (parseFloat(a, 10) / 0.95) + 'rem'
})

fs.writeFileSync('./style.less', less)

console.log(less)

