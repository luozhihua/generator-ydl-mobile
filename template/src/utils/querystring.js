export default class Querystring {
  static parse(url = '') {
    let params = url.match(/(^|\?|\&)+(\w+=\w+)/gi)
    let result = {}

    params.forEach(param => {
      param = param.replace(/^[\?\&]/, '').split('=')

      result[param[0]] = result[param[1]]
    })

    return result
  }

  static stringify(params) {
    let results = []

    Object.keys(params).forEach(key => {
      if (key !== 'toString') {
        results.push(`${key}=${params[key]}`)
      }
    })

    return results.join('&')
  }
}
