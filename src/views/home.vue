<template>
  <div class="page-wrapper">
    <head-nav :show="showNav"></head-nav>
    <div :class="showNav?'nav-body-fix':''">
      <index></index>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import index from './index/index.vue'
  export default {
    name: 'home',
    components: {
      index
    },
    data()
    {
      return {
      }
    },
    computed: mapState(['showNav']),
    methods: {
    },
  }
</script>

<style lang="scss">
</style>