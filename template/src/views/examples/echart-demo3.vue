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
            left: '10%'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {},
          xAxis: {
            type: 'category',
            boundaryGap: ['20%', '20%'],
            data: ['第1周', '第2周', '第3周', '第4周'],
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
          },
          yAxis: {
            type: 'value',
            max: 50,
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            splitArea: {       //分割区域
              show: true,
              interval: 'auto',
              areaStyle: {
                // color: 'rgba(155,155,155,1)'
              }
            },
          },
          series: [
            {
              name: '拜访次数',
              type: 'line',
              data: [25, 10, 30, 25],
              markLine: {
                data: [
                  {type: 'average', name: '平均值',}
                ]
              },
              itemStyle: {
                normal: {
                  color: 'rgba(54,81,162,1)',
                  lineStyle: {
                    color: 'rgba(54,81,162,1)'
                  }
                }
              },
            }
          ]
        };
        chart.setOption(option)
      }))
    }
  }
</script>

