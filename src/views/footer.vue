<template>
  <div class="app-footer-wrapper">
    <footer class="private-copyright">@tanphilf 版权所有</footer>
  </div>
</template>

<script>
  export default {
    name: 'web-footer',
    props: {},
    data()
    {
      return {
      }
    },

    methods: {}
  }
</script>

<style lang='scss'>
  .app-footer-wrapper {

    /* position: absolute;
    left: 0;
    bottom: 30px;
    width: 100%; */
    .private-copyright {
      font-size: 10px;
      color: #676767;
    }
  }
</style>