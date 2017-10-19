<template>
  <transition name="slideDown">
    <div class="js-toast"><slot></slot></div>
  </transition>
</template>

<script>
  export default {
    NAME: 'Toast',

    mounted() {}
  }
</script>

<style>
  .js-toast {
    border-radius: 50rem;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
  }
</style>
