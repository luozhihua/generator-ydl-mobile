import Mock from 'mockjs'

export default function (config) {
  return Mock.mock({
    id: '@increment',
    name: '@ctitle(2, 10)',
    parentId: '@increment',
    sortIndex: '@increment'
  })
}
