<template>
  <div id="icreator">
    <totast></totast>
    <router-view />
  </div>
</template>

<script>
  require('@/utils/device')
  export default {
    data()
    {
      return {
      }
    },
    created()
    {
      this.init()
    },
    methods: {
      init()
      {
        UI.init(this)
        window.addEventListener('scroll', (e) =>
        {
          let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
          let { offsetHeight, clientHeight } = document.documentElement
          this.$store.dispatch('setNavState', scrollTop >= 300)
          this.$root.$emit('scroll', {
            scrollTop,
            offsetHeight,
            clientHeight
          })
        })
      },
    },
  }
</script>

<style lang="scss">
  @import '~@/common/common.scss';

  #app {
    font-family: Arial, Avenir, Helvetica, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    overflow-y: auto;
  }

  html,
  body {
    background-color: #f2f2f2;
    color: #333;
  }

  footer {
    padding: 10px;
  }

  .nav-body-fix {
    padding-top: 50px !important;
  }
</style>