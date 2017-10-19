<template>
  <Page>
    <section>
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" ref="myMain" style="width: 400px;height:270px"></div>
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
            subtext: '金额元',
            left: '10%',
          },
          color: ['rgba(235,235,235,1)', 'rgba(205,204,205,1)'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              opacity: ''
            },
            backgroundColor: ['rgba(231,238,252,1)']
          },
          legend: {
            data: ['项目数', '合作伙伴']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            axisLabel: {
              textStyle: {color: 'rgba(155,155,155,1)'}
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            }

          },
          yAxis: {
            type: 'category',
            data: ['大我', '大冰', '多米', '金明'],
            axisLabel: {
              textStyle: {color: 'rgba(155,155,155,1)'}
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            }
          },
          series: [
            {
              name: '销售目标',
              type: 'bar',
              data: [10, 20, 40, 50]
            },
            {
              name: '完成业绩',
              type: 'bar',
              data: [10, 40, 20, 30]
            }
          ]
        };
        chart.setOption(option)
      }))
    }
  }
</script>
