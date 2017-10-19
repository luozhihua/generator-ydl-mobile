<template>
  <Page>
    Details of sales: {{$query.name}}.
  </Page>
</template>


<script>
  export default {
    data: function () {
      return {}
    },

    created: function () {
      this.$ajax.get(`/sales.json?name=${this.$route.query.name}`).then(response => {

      })
    }
  }
</script>
