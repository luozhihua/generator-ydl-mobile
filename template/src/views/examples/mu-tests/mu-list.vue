<template>
  <Page>
    <h1 slot="header">Home.vue</h1>

    <div style="height: 1000px; margin: 2em; xbackground-color: blue; ">
      Content of home.vue


      --------
      <Icon name="xihuan" color="red" size="48px"></Icon>
      <Button className="primary" theme="red">你好</Button>

      <Button className="success">你好</Button>
      <Button className="info">你好</Button>
      <Button className="primary">你好</Button>
      <Button className="default">你好</Button>
      <Button className="warnnig">你好</Button>
      <Button className="error">你好</Button>

      <Button className="primary" theme="red" size="tiny">你好</Button>
      <Button className="primary" theme="red" size="small">你好</Button>
      <Button className="primary" theme="red" size="normal">你好</Button>
      <Button className="primary" theme="red" size="large">你好</Button>
      <Button className="primary" theme="red" size="big">你好</Button>

      <div>
        <input v-model.number="firstNumber" type="number" step="20">
        <p>
          <AnimateNumber v-bind:value="firstNumber"></AnimateNumber>
        </p>
      </div>

      <mu-date-picker hintText="竖屏模式选择"/>
      <br/>`
      <mu-toast v-if="toast" message="一段简单的文本" @close="hideToast"/>
      <Button v-on:click="showToast()">Toast</Button>

      =========
      <mu-list>
        <mu-list-item title="Inbox">
          <mu-icon slot="left" value="inbox"/>
        </mu-list-item>
        <mu-list-item title="Starred">
          <mu-icon slot="left" value="grade"/>
        </mu-list-item>
        <mu-list-item title="Sent mail">
          <mu-icon slot="left" value="send"/>
        </mu-list-item>
        <mu-list-item title="Drafts">
          <mu-icon slot="left" value="drafts"/>
        </mu-list-item>
      </mu-list>
      <mu-divider/>
      <mu-list>
        <mu-list-item title="All mail">
          <mu-icon slot="right" value="info"/>
        </mu-list-item>
        <mu-list-item title="Trash">
          <mu-icon slot="right" value="info"/>
        </mu-list-item>
        <mu-list-item title="Spam">
          <mu-icon slot="right" value="info"/>
        </mu-list-item>
        <mu-list-item title="Follow up">
          <mu-icon slot="right" value="info"/>
        </mu-list-item>
      </mu-list>
    </div>

    <div slot="footer">Footer</div>
  </Page>
</template>

<script>
  //  import List from 'muse-ui/src/list'

  export default {
    components: {
      //      List
    },
    created: function () {
      this.$storage.setItem('a', 123)
      console.log(this.$storage.getItem('a'))
    },
    data: function () {
      return {
        firstNumber: 10,
        toast: false,
        a: 1,
        b: 2
      }
    },
    methods: {
      showToast() {
        this.toast = true

        setTimeout(() => { this.toast = false }, 3000)
      },

      hideToast() {
        this.toast = false
      }
    }
  }
</script>
