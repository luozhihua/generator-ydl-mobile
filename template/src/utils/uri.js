/**
 * URL格式化类
 * @author Colin<mail@luozhihua.com>
 */
export default class Uri {

  /**
   * Constructor
   * @param {Stirng} uri 需要格式化的URL地址
   * @returns {*}
   */
  constructor (uri = '') {
    let parsedUri = uri.match(/(\w+):\/\/([^:\/\?]*):?(\d*)([^\?]*)\??([^#$]*)#?([^#]*)/) || []

    this.scheme = parsedUri[1] || ''
    this.protocol = parsedUri[1] || ''
    this.domain = parsedUri[2] || ''
    this.host = parsedUri[2] || ''
    this.port = parsedUri[3] || ''
    this.path = parsedUri[4] || ''
    this.queryString = parsedUri[5] || ''
    this.search = parsedUri[5] || ''
    this.hash = parsedUri[6] || ''
  }

  /**
   * 获取所有参数集合
   * @returns {Map}
   */
  getParams () {
    let paramsSet = this.queryString.split('&')
    let params = {}

    paramsSet.forEach((param) => {
      let paramArr = param.split('=')

      if (paramArr[0]) {
        params[paramArr[0]] = paramArr[1]
      }
    })
    return params
  }

  /**
   * 获取参数值
   * @returns {String}
   */
  getParam (paramName) {
    return this.getParams()[paramName]
  }

  /**
   * 设置或更新参数
   * @param {String} paramName
   * @param {String} value
   */
  setParam (paramName, value) {
    let params = this.getParams()
    let result = []

    if (typeof value === 'undefined') {
      delete params[paramName]
    } else {
      params[paramName] = value
    }

    for (let k in params) {
      result.push(k + '=' + params[k])
    }

    this.queryString = result.join('&')

    return this
  }

  /**
   * 设置或更新参数
   * @param {Map} list
   */
  setParams (list) {
    let params = this.getParams()
    let result = []

    for (let h in list) {
      if (params[h] === null) {
        delete params[h]
      } else {
        params[h] = list[h]
      }
    }

    for (let k in params) {
      result.push(k + '=' + params[k])
    }

    this.queryString = result.join('&')

    return this
  }

  toString () {
    let url = []

    url.push(this.scheme ? (this.scheme + '://') : '')
    url.push(this.host)
    url.push(this.port ? (':' + this.port) : '')
    url.push(this.path)
    url.push(this.queryString ? ('?' + this.queryString) : '')
    url.push(this.hash ? ('#' + this.hash) : '')

    return url.join('')
  }
}
