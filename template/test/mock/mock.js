/* eslint no-underscore-dangle:off */
import {isFunction, isString} from 'lodash'
import Mock from 'mockjs'

function wrapper (path, request) {
  let data
  let response

  if (isString(path)) {
    data = require(`./${path}`)
    data = data.__esModule ? data.default : data
    data = isFunction(data) ? data() : data
  } else if (isFunction(path)) {
    data = path(request)
  } else {
    data = path
  }

  response = {
    'code': '1',
    'message': '成功',
    'data': data
  }

  console.log(
    `MockJS(${request.type.toUpperCase()}) ${request.url}; \n`,
    'REQUEST: ', request,
    '\nRESPONSE: ', response)

  return response
}

/*
 GET（SELECT）：从服务器取出资源（一项或多项）。
 POST（CREATE）：在服务器新建一个资源。
 PUT（UPDATE）：在服务器更新资源（客户端提供完整资源数据）。
 PATCH（UPDATE）：在服务器更新资源（客户端提供需要修改的资源数据）。
 DELETE（DELETE）：从服务器删除资源。
 */

/**
 * 拦截GET请求
 * @export get
 * @param rule 用于匹配 API 地址的正则表达式
 * @param path 数据生成器地址
 */
export function get (rule, path) {
  Mock.mock(rule, 'get', options => wrapper(path, options))
}

/**
 * 拦截POST请求
 * @export post
 * @param rule 用于匹配 API 地址的正则表达式
 * @param path 数据生成器地址
 */
export function post (rule, path) {
  Mock.mock(rule, 'post', options => wrapper(path, options))
}

/**
 * 拦截PUT请求
 * @export put
 * @param rule 用于匹配 API 地址的正则表达式
 * @param path 数据生成器地址
 */
export function put (rule, path) {
  Mock.mock(rule, 'put', options => wrapper(path, options))
}

/**
 * 拦截PATCH请求
 * @export patch
 * @param rule 用于匹配 API 地址的正则表达式
 * @param path 数据生成器地址
 */
export function patch (rule, path) {
  Mock.mock(rule, 'get', options => wrapper(path, options))
}

/**
 * 拦截DELETE请求
 * @export delete
 * @param rule 用于匹配 API 地址的正则表达式
 * @param path 数据生成器地址
 */
export function del (rule, path) {
  Mock.mock(rule, 'delete', options => wrapper(path, options))
}

/**
 * 拦截请求(不限Method类型)
 * @export delete
 * @param rule 用于匹配 API 地址的正则表达式
 * @param path 数据生成器地址
 */
export function mock (rule, path) {
  Mock.mock(rule, options => wrapper(path, options))
}
