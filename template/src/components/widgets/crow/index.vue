<template>
  <div>
    <component @stop="onStop" ref="player" :list="data" :is="player"></component>
  </div>
</template>

<script>
  import {isArray, isString} from 'lodash'

  export default {

    props: {
      api: {type: String}
    },

    data() {
      return {
        player: null,
        data: [],
        timer: null
      }
    },

    mounted: function () {
      this.next(15000)
    },

    methods: {

      async load() {
        let vm = this
        let response = await this.$ajax.get(this.api)

        if (isString(response.data)) {
          try {
            response.data = JSON.parse(response.data)
          } catch (e) {}
        }

        if (isArray(response.data) && response.data.length > 0) {
          vm.data = response.data

          import('./player.vue')
            .then((player) => {
              vm.player = player
              vm.next()
            })
            .catch((e) => {
              vm.next()
            })
        }
      },

      next(timeout = 1000 * 60 * 5) {
        clearTimeout(this.timer)

        this.timer = setTimeout(() => {
          if (this.api) {
            this.load()
          }
        }, timeout)
      },

      onStop() {
        this.player = null
      }
    }
  }
</script>
