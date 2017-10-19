<template>
  <Page>
    <section>
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" ref="myMain" style="width: 400px;height:300px"></div>
    </section>
  </Page>
</template>

<script>
  export default {
    mounted() {
      let el = this.$refs.myMain;

      import('components/echarts').then((echarts => {
        let chart = echarts.init(el)

        let option = {
          title: {
            text: '',
            subtext: '次数',
            left: '10%',
          },
          // tooltip : {
          //     trigger: 'axis',
          //     axisPointer: {
          //         type: 'shadow',
          //         opacity: ''
          //     },
          // },
          color: ['rgba(231,238,252,1)', 'rgba(54,81,162,0.5)'],
          calculable: true,
          grid: {
            right: 20,
            left: 40,
          },
          xAxis: [
            {
              type: 'category',
              data: ['新增商机', '新增客户', '新增订单', '阶段变化的商机'],
              axisLabel: {
                textStyle: {color: 'rgba(155,155,155,1)'}
              },
              axisTick: {
                show: false
              },
              axisLine: {
                show: false
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                textStyle: {color: 'rgba(155,155,155,1)'}
              },
              axisTick: {
                show: false
              },
              axisLine: {
                show: false
              }
            }
          ],
          series: [
            {
              name: '蒸发量',
              type: 'bar',
              data: [2.0, 4.9, 7.0, 23.2],
              barWidth: 15,
            },
            {
              name: '降水量',
              type: 'bar',
              data: [2.6, 5.9, 9.0, 26.4],
              barWidth: 15,
            },
          ]
        };
        chart.setOption(option)
      }))
    }
  }
</script>

