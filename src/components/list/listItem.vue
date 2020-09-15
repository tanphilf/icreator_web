<template>
  <div class="component-list-item-wrapper">
    <transition :name="transitionType" :duration="duration">
      <div v-if="loaded" :class="[visible?'ct-ls-item-show':'ct-ls-item-hide']">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'listItem',
    props: {
      parent: {
        type: String,
        default: 'parent'
      },
      index: {
        type: Number,
        default: -1
      },
      duration: {
        type: Number,
        default: 500
      },
      transitionType: {
        type: String,
        default: 'default',
        validator(tp)
        {
          return ['default', 'fade', 'slide', 'zoom-in', 'zoom-out'].indexOf(tp) !== -1
        }
      }
    },
    data()
    {
      return {
        loaded: false,
        visible: false
      }
    },

    created()
    {
      // 监听父列表滚动
      this.$root.$on('scroll', this.update)
      this.$parent.$on('scroll', this.update)
    },

    destroyed()
    {
      this.$root.$off('scroll', this.update)
      this.$parent.$off('scroll', this.update)
    },

    mounted()
    {
      this.$nextTick(this.update)
    },

    beforeUpdate()
    {
      if (!(this.loaded || this.visible)) {
        this.update(true)
      }
    },

    methods: {
      // --- 提升性能&懒加载方案：
      // 暂时渲染page*pageSize范围内的列表项，距离列表顶部的第一项默认渲染，其后的pageSize-1项hidden，
      // 超出范围的其他列表项用v-if不显示，等这些列表项在父列表滚动时，距离列表顶部loadMoreDistance的距离时，
      // 再将其v-if置true，动态添加到列表中
      // loaded：
      update(loaded = false)
      {
        if (loaded) {
          return this.loaded = this.visible = true
        }

        let {
          offsetTop: itemOffsetTop,
          offsetLeft: itemOffsetLeft,
          offsetWidth: itemOffsetWidth,
          offsetHeight: itemOffsetHeight,
        } = this.$el

        let {
          page,
          pageSize,
          horizontal,
          offsetWidth,
          offsetHeight,
          scrollLeft,
          scrollTop,
          offsetTop,
          offsetLeft,
          loadMoreDistance,
        } = this[`$${this.parent}`];

        pageSize = pageSize || 10;
        // 预加载pageSize个列表项,已经滚动相距loadMoreDistance的列表项
        this.loaded = this.index <= page * pageSize

        // 视窗固定范围[winMin, winMax]，
        let winMin = horizontal ? scrollLeft + offsetLeft : scrollTop + offsetTop;
        let winMax = winMin + (horizontal ? offsetWidth : offsetHeight);
        // 新创建的item的offsetTop刚拿到的全是相同的值（item的高度还没确定）
        // 可见区域，超出之外全部hidden, area = viewMax + pageArea
        let visibleMaxArea = winMax + pageSize * (horizontal ? itemOffsetWidth : itemOffsetHeight);
        let itemTop = horizontal ? itemOffsetLeft : itemOffsetTop;
        this.visible = itemTop >= winMin && itemTop <= visibleMaxArea
        // 未创建的列表项高度为0，全部在列表底部，当当前列表项没有完全显示完时
      }
    }
  }
</script>

<style lang='scss'>
  .component-list-item-wrapper {
    flex-shrink: 0;
    position: relative;
    opacity: 1;

    /* 钩子过渡动画 */
    .default-enter-active,
    .default-leave-active {
      transition: all .36s ease-out;
    }

    .default-enter,
    .default-leave-to {
      opacity: 0;
      transform: translateY(30px);
    }

    .default-enter-to,
    .default-leave {
      opacity: 1;
      transform: translateY(0);
    }

    /* fade */
    .fade-enter-active,
    .fade-leave-active {
      transition: all .5s;
    }

    .fade-enter,
    .fade-leave-to {
      opacity: 0.2;
    }

    .fade-enter-to,
    .fade-leave {
      opacity: 1;
    }

    /* slide */
    .slide-enter-active,
    .slide-leave-active {
      transition: all .36s;
    }

    .slide-enter,
    .slide-leave-to {
      transform: translateX(30px);
    }

    .slide-enter-to,
    .slide-leave {
      transform: translateX(0);
    }

    /* zoomIn */
    .zoom-in-enter-active,
    .zoom-in-leave-active {
      transition: all .36s;
    }

    .zoom-in-enter,
    .zoom-in-leave-to {
      transform: scale(.8);
    }

    .zoom-in-enter-to,
    .zoom-in-leave {
      transform: scale(1);
    }

    /* zoomOut */
    .zoom-out-enter-active,
    .zoom-out-leave-active {
      transition: all .36s;
    }

    .zoom-out-enter,
    .zoom-out-leave-to {
      transform: scale(1.2);
    }

    .zoom-out-enter-to,
    .zoom-out-leave {
      transform: scale(1);
    }

    .component-list-item-loading-cover {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba($color: white, $alpha: 0.32);
      text-align: center;
      opacity: 0;
      z-index: -1;
    }

    @keyframes listItemShow {
      0% {
        opacity: 0;
        visibility: hidden;
      }

      100% {
        opacity: 1;
        visibility: visible;
      }
    }

    @keyframes listItemHide {
      0% {
        opacity: 1;
        visibility: visible;
      }

      100% {
        opacity: 0;
        visibility: hidden;
      }
    }

    .ct-ls-item-show {
      animation: listItemShow .12s ease-out;
      visibility: visible;
    }

    .ct-ls-item-hide {
      /* animation: listItemHide .12s ease-in; */
      visibility: hidden;
    }

  }
</style>