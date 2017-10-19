import Echarts from './echarts.vue'

export async function load () {
  return await import('./echarts.js')
}

export default Echarts
