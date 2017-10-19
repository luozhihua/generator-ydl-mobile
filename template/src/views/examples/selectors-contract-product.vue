<template>
  <Page title="订单产品选择器">
    <Panel>

      <select v-model="options.params.serviceId" placeholder="请选择...">
        <option value="92">92</option>
        <option value="96">96</option>
        <option value="102">102</option>
        <option value="136">136</option>
        <option value="137">137</option>
        <option value="138">138</option>
        <option value="139">139</option>
      </select>

      <ProductContract v-model="products" :options="options">
        <i class="yd-icon yd-grid"></i> 选择订单的产品
      </ProductContract>

      <pre>{{ JSON.stringify(products, 2, 2) }}</pre>
    </Panel>
  </Page>
</template>

<script>
  export default {
    /**
     * 默认数据
     */
    data: function () {

      return {
        id: 1,
        products: [],
        options: {
          title: '选择订单产品',
          url: '/api/contract/queryContractProductList',
          params: {
            serviceType: 0,
            serviceId: this.serviceId
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>

  h1 {
    color: red;
  }

  pre {
    border: 1px solid #eee;
    border-radius: 1rem;
    padding: 1rem;
    background-color: #eee;
    margin: 1rem 1rem 3rem;
  }
</style>
