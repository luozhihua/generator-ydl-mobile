import Mock from 'mockjs'

export default function (config) {
  const List = []
  const count = Math.floor(Math.random() * 3)

  for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
      id: '@increment',
      name: '@ctitle(2, 10)',
      parentId: '@increment',
      sortIndex: '@increment',
      'children|3-6': [
        {
          id: '@increment',
          name: '@ctitle(2, 10)',
          parentId: '@increment',
          sortIndex: '@increment',
          'children|1-3': [
            {
              id: '@increment',
              name: '@ctitle(2, 10)',
              parentId: '@increment',
              sortIndex: '@increment',
              'children|3-6': [
                {
                  id: '@increment',
                  name: '@ctitle(2, 10)',
                  parentId: '@increment',
                  sortIndex: '@increment'
                }
              ]
            }
          ]
        }
      ]
    }))
  }

  return List
}
