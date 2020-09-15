<template>
  <div class="page-wrapper">
    <head-nav :show="showNav"></head-nav>
    <router-view :class="showNav?'nav-body-fix':''"></router-view>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'home',
    components: {
    },
    data()
    {
      return {
      }
    },
    computed: mapState(['showNav']),
    created()
    {
      this.$router.push('/index')
    },
    methods: {
    },
  }
</script>

<style lang="scss">
</style>