<template>
  <Page>
    <div class="title font" @click="toggle()">
      <p><span>{{text}}</span>目标达成情况</p>
    </div>
    <div class="demo" v-if="dialog">
      <span :class="isActive(1)" @click="setPresentType(1)" v-model="text">当月</span>
      <span :class="isActive(2)" @click="setPresentType(2)" v-model="text">当季</span>
      <span :class="isActive(3)" @click="setPresentType(3)" v-model="text">当年</span>
    </div>
    <div class="demo1">

    </div>
  </Page>
</template>

<script>
  export default {

    /**
     * 默认数据
     */
    data: function () {
      return {
        dialog: false,
        setType: '',
        text: ''
      }
    },

    created: function () {

    },

    methods: {
      toggle: function () {
        if (this.dialog == false) {
          this.dialog = true;
        } else {
          this.dialog = false;
        }
      },
      isActive(type) {
        return {
          active: (this.setType === type)
        }
      },
      setPresentType(type, text) {
        this.setType = type;
        if (this.setType == 1) {
          text = "当年";
        } else if (this.setType == 2) {
          text = "当季";
        } else {
          text = "当年";
        }
      },
    }
  }
</script>

<style lang="less" scoped="">
  .title {

  }

  .demo {
    display: flex;
    justify-content: space-around;
    span {
      display: block;
      padding: 1rem 3rem;
      background-color: skyblue;
      opacity: .6;
      border-radius: .8rem;
      &.active {
        color: #fff;
        background-color: #ccc;
      }
    }
  }

  .demo1 {
    width: 100%;
    height: 50px;
    background-color: #ccc;
  }

</style>
