<template>
  <div class="advertisement" @click="toAd">
    <ximage v-if="ad.cover" :src="ad.cover" width="100%" height="100%" mode="aspectFill"></ximage>
  </div>
</template>

<script>
  export default {
    name: 'ad',
    props: {
      ad: {
        required: true,
        type: Object,
        default: function ()
        {
          return {}
        }
      }
    },
    data()
    {
      return {
      }
    },

    methods: {
      toAd()
      {
        UI.showToast({
          content: '广告建设中...'
        })
      }
    }
  }
</script>

<style lang='scss'>
  .advertisement {
    width: 100%;
    height: 100%;
    max-width: 320px;
    min-width: 100px;
    max-height: 320px;
    min-height: 100px;
  }
</style>