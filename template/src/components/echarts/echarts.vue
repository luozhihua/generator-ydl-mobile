<template>
  <div class="js-echarts" :style="customStyle"></div>
</template>

<script>
  async function load() {
    return await import('./echarts')
  }

  export default {
    NAME: ['Echart', 'Echarts'],

    props: {
      options: {type: Object},
      width: {type: [String, Number], default: '100%'},
      height: {type: [String, Number]},
      click: {type: Function}
    },

    data() {
      return {
        chart: null
      }
    },

    computed: {
      customStyle() {
        return {
          width: this.width,
          height: this.height
        }
      }
    },

    mounted: async function () {
      let echarts = await load()

      this.chart = echarts.init(this.$el)
      this.chart.setOption(this.options);

      //至少选择一个状态
      this.chart.on('legendselectchanged', (parm) => {
        //if(!this.options.legend.lastSelect) return;
        let num = 0, total = 0;

        for (var i in parm.selected) {
          total++;
          if (parm.selected[i] === false) {
            num++;
          }
        }
        if (num === total) {
          parm.selected[parm.name] = true;
        }
        this.chart.setOption({
          legend: parm
        })
      })

      this.chart.on('click', this.click)

      window.addEventListener('resize', this.onWindowResize)
    },

    destroyed() {
      window.removeEventListener('resize', this.onWindowResize)
    },

    watch: {
      options: {
        handler(options) {
          if (this.chart) {
            this.chart.setOption(options, false)
          }
        },
        deep: true
      }
    },

    methods: {
      onWindowResize() {
        this.chart.resize()
      }
    }
  }
</script>
