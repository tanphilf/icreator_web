<template>
  <div class="component-list-wrapper" :style="{background, width, height}">
    <!-- 列表loading过渡浮层 -->
    <div class="ct-ls-load-cover-wrapper"></div>
    <div @scroll="onListScroll" :class="['ct-ls-content-wrapper', horizontal?'ct-ls-scroll-x':'ct-ls-scroll-y']"
      :style="{width, height}">
      <slot></slot>
      <div v-if="enableLoadMore" ref="loadMore"
        :class="['ct-ls-loading-more', horizontal?'ct-ls-loading-more-fix':'', loadMore?'ct-ls-load-more-show':'ct-ls-load-more-hide']">
        {{loadMoreText}}</div>
    </div>
  </div>
</template>

<script>
  function unitFix(p)
  {
    if (!p) {
      return
    }
    p = p.toString();
    let d = parseFloat(p);
    return d + (p.slice(p.indexOf(d) + d.toString().length) || 'px');
  }

  export default {
    name: '',
    props: {
      width: {
        type: [Number, String],
        default: '100%'
      },
      height: {
        type: [Number, String],
        default: '100%'
      },
      vertical: {
        type: Boolean,
        default: true
      },
      horizontal: {
        type: Boolean,
        default: false
      },
      enableLoadMore: {
        type: Boolean,
        default: true
      },
      background: {
        type: String,
        default: undefined
      },
      loadMoreDistance: {
        type: Number,
        default: 80
      },
      loadMoreText: {
        type: String,
        default: '加载中...'
      },
      pageSize: {
        type: Number,
        default: 10
      }
    },

    data()
    {
      return {
        timer: null,
        loadMore: false,
        loadMoreLimit: false,
        loadMoreTimer: null,
        offsetHeight: 0,
        offsetTop: 0,
        offsetLeft: 0,
        scrollTop: 0,
        scrollLeft: 0,
        page: 1, // 维护一个列表页，给子列表项定位自身位置，默认10个一页
      }
    },

    created()
    {
      if (window) {
        window.addEventListener("orientationchange" in window ? "orientationchange" : "resize", this.fresh, false)
      }
    },

    mounted()
    {
      this.fresh()
    },

    methods: {
      fresh()
      {
        let { offsetHeight, offsetWidth, scrollTop, offsetTop, offsetLeft } = this.$el
        this.offsetHeight = offsetHeight
        this.offsetWidth = offsetWidth
        this.offsetTop = offsetTop
        this.offsetLeft = offsetLeft
      },

      onListScroll(e)
      {
        let { scrollLeft, scrollTop, offsetTop, offsetLeft } = e.target
        // 记录滚动量，给新创建的listItem参考
        this.scrollTop = scrollTop
        this.scrollLeft = scrollLeft

        if (this.enableLoadMore) {
          let distance = false;
          if (this.horizontal) {
            distance = this.$refs.loadMore.offsetLeft - offsetLeft;
            this.loadMore = scrollLeft + this.offsetWidth >= distance - this.loadMoreDistance
          } else {
            // 底部加载更多距离列表顶部距离，需要减去父列表的offsetTop
            distance = this.$refs.loadMore.offsetTop - offsetTop;
            /* 判断是否加载更多：页面滚动量+列表高度/宽度>= 底部加载更多块的offsetTop/offsetLeft - 偏移量 （底部更多显示就加载）*/
            this.loadMore = scrollTop + this.offsetHeight >= distance - this.loadMoreDistance
          }

          if (this.loadMore) {
            // 节流
            clearTimeout(this.loadMoreTimer)
            this.loadMoreTimer = setTimeout(() =>
            {
              this.$emit('loadMore', e)
              this.page++
            }, 500);
          }
        }

        // 防抖
        clearTimeout(this.timer)
        this.timer = setTimeout(() =>
        {
          this.$emit('scroll', e)
          clearTimeout(this.timer)
        });

      },

      onGoTop()
      {
        this.$refs.list.scrollTop = 0
      }
    }
  }
</script>

<style lang='scss' scoped>
  .component-list-wrapper {

    /* 列表过渡动画 */
    .default-enter-active,
    .default-leave-active {
      transition: all .8s;
    }

    .default-enter,
    .default-leave-to {
      opacity: 0.5;
      transform: translateY(30px);
    }

    .default-enter-to,
    .default-leave {
      opacity: 1;
      transform: translateY(0);
    }

    .ct-ls-scroll-x {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      overflow-x: scroll;
      overflow-y: hidden;
    }

    .ct-ls-scroll-y {
      overflow-y: scroll;
      overflow-x: hidden;
    }

    .ct-ls-content-wrapper {

      /* -webkit-overflow-scrolling: touch; */
      &::-webkit-scrollbar {
        /* 整体滚动条 */
      }

      &::-webkit-scrollbar-thumb {
        /* 滚动方块 */
        /* border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #eaeaea; */
      }

      &::-webkit-scrollbar-track {
        /* 滚动轨道 */

      }

      .ct-ls-loading-more {
        text-align: center;
        font-size: 12px;
        color: #989898;
        padding: 5px 0;
        opacity: 0;
      }

      .ct-ls-loading-more-fix {
        width: 20px;
        word-break: break-all;
      }

      .ct-ls-load-more-show {
        opacity: 1 !important;
        transition: opacity .42s ease-out;
      }

      .ct-ls-load-more-hide {
        opacity: 0 !important;
        transition: opacity .42s ease-in;
      }
    }
  }
</style>