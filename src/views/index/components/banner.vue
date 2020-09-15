<template>
  <div class="banner-wrapper">
    <swiper @change="onSwiperChange" class="swiper-wrapper" :current="2" autoplay>
      <swiper-item @click="(e)=>onClick(index,e)" v-for="(item, index) in items" :key="'swiperItem'+index"
        :index="index">
        <div class="swiper-item-content">
          <ximage :src="item.cover" mode="aspectFill" width="100%" height="300px">
          </ximage>
        </div>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
  export default {
    name: 'banner',
    props: {
      items: {
        type: Array,
        default: function ()
        {
          return []
        }
      }
    },
    data()
    {
      return {
      }
    },

    methods: {
      onSwiperChange(e)
      {
        // console.log('banner改变：', e)
      },
      onClick(idx, e)
      {
        e.preventDefault();
        let route = this.$router.resolve({
          path: '/detail/' + this.items[idx].article_id,
        })
        window.open(route.href, '_blank')
      },
    }
  }
</script>

<style lang='scss'>
  .banner-wrapper {
    height: 100%;
    background-color: white;
  }
</style>