<template>
  <div class="notFound-page-wrapper">
    <div class="error-blank-container">
      <h1 class="error-404">404</h1>
      <p>页面走丢了~</p>
      <p>请检查输入地址是否有误</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'notFound',
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
  .notFound-page-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #f2f2f2;
    color: #666;
    font-size: 18px;

    .error-blank-container {
      padding: 20px 32px;
      line-height: 2;

      .error-404 {
        font-size: 56px;
        font-weight: 600;
      }
    }
  }
</style>