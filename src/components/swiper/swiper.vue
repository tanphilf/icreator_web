<template>
  <div class="component-swiper-wrapper">
    <div class="cpt-swiper-drag-handler" :style="dragHandlerStyle" @mouseleave="onLeave"
      @transitionend="onTransitionEnd">
      <slot></slot>
    </div>
    <div class="cpt-swiper-pagination-wrapper">
      <div @click="goTo(i)" :style="{backgroundColor: i===currentValue?paginationColor: paginationBgColor}"
        class="cpt-swiper-pagination-dot" v-for="(p, i) in length" :key="'swiperPagination'+i">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'swiper',
    props: {
      direction: {
        type: String,
        default: 'horizontal',
        validator(d)
        {
          return ['horizontal', 'vertical'].indexOf(d) !== -1
        }
      },
      current: {
        type: [Number, String],
        default: 0
      },
      loop: {
        type: Boolean,
        default: true
      },
      autoplay: {
        type: Boolean,
        default: false
      },
      duration: {
        type: [Number, String],
        default: 540
      },
      interval: {
        type: [Number, String],
        default: 3000
      },
      paginationBgColor: {
        type: String,
        default: 'rgba(240,240,240,0.84)'
      },
      paginationColor: {
        type: String,
        default: 'red'
      }
    },
    watch: {
      current: {
        handler(c)
        {
          this.crt = this.initCurrent = Math.min(Math.max(0, c), this.length - 1);
        }
      }
    },
    data()
    {
      return {
        dt: 0,
        crt: 0,
        length: 0,
        page: 0, // loop分页
        position: 0, // 记录已经滑动的位移量
        autoTimer: null,
        size: null, // 当前滑块的尺寸大小
        dragHandlerStyle: {},
        enableTransition: false,
        gesture: null,
        initCurrent: 0, // 初始化的有效current
        currentValue: 0, // 变化中的有效current
      }
    },

    mounted()
    {
      this.$nextTick(() =>
      {
        this.updateSize()
        this.updatePosition(0);
        setTimeout(() =>
        {
          this.length = this.$children.length;
          this.startAutoPlay()
        }, 1200);
      })
      // 更新当前滑块的拖动量
      this.$on('positionChange', this.onPositionChange)
      // pc端浏览器窗口聚焦状态变化
      window.addEventListener('visibilitychange', this.onPageStatusChange)
      // 窗口尺寸状态变化，需要同步滚动窗口尺寸以及子item的位置
      window.addEventListener("orientationchange" in window ? "orientationchange" : "resize", this.updateSize, false)
    },

    destroyed()
    {
      clearInterval(this.autoTimer)
      this.autoTimer = null
      this.$off('positionChange', this.onPositionChange)
      window.removeEventListener('visibilitychange', this.onPageStatusChange)
      window.removeEventListener("orientationchange" in window ? "orientationchange" : "resize", this.updateSize, false)
    },

    methods: {
      // 防止视图窗口变化导致尺寸不准确
      updateSize()
      {
        let { offsetHeight, offsetWidth } = this.$el
        this.size = this.direction === 'horizontal' ? offsetWidth : offsetHeight
      },

      // 页面显示隐藏下，自动播放暂停控制
      onPageStatusChange(e)
      {
        if (e.target.visibilityState === 'visible') {
          this.startAutoPlay()
        } else {
          this.stopAutoPlay()
        }
      },

      setGestureIndex(current)
      {
        this.gesture = current
      },

      getGestureIndex()
      {
        return this.gesture
      },

      // 手动拖动item，在当前position基础上加上增量dt
      onPositionChange(dt)
      {
        this.stopAutoPlay()
        this.dt = dt;
        this.enableTransition = dt === 0;
        this.updatePosition(dt)
        this.loopFix()
      },

      goTo(idx)
      {
        this.stopAutoPlay()
        this.crt += (idx - this.currentValue)
        this.position = -this.size * (this.crt - this.initCurrent);
        this.reset()
        if (this.autoplay) {
          this.$nextTick(this.startAutoPlay)
        }
        this.emit()
      },

      next()
      {
        if (this.length > 1) {
          // 保证滑动不超出
          this.crt++
          this.position = -this.size * (this.crt - this.initCurrent);
          this.emit()
        }
        this.reset()
      },

      before()
      {
        if (this.length > 1) {
          this.crt--
          this.position = -this.size * (this.crt - this.initCurrent);
          this.emit()
        }
        this.reset()
      },

      emit()
      {
        this.currentValue = Math.abs(this.crt) % this.length
        this.$emit('change', {
          current: this.currentValue
        })
      },

      /* 
       实现思路：page和current都可为负数，在队尾和队首拦截拖动事件，根据变化的dt方向来判断是否需要补足
       方法都是截取除当前元素之外的其他整体元素放到队首或者队尾。
       实现需要每个Item知道自身的定位，当前page变化时item的index需要同步更新，item的状态index是为实现
       该元素absolute定位用的，实际传入的props的Index不变，需要保证每个item的最外层元素尺寸相同，根据
       item的index*size可实现静态定位，然后拖动位移以及swiper的change事件都只是swiper次外层的包裹
       元素来实现位移效果。
      */
      loopFix()
      {
        if (this.loop) {
          if (this.dt < 0) {
            // 在页面末尾最后一项时触发
            if (this.crt === (this.page + 1) * (this.length - 1)) {
              this.page++
              this.$emit('updateItemPosition', {
                next: true,
                max: this.crt - 1, // 每次替补的范围个数
                min: this.crt - this.length + 1,
                dIndex: this.length,
                swiperPosition: this.position,
              })
            }

          } else if (this.dt > 0) {
            // 在页面最前面一项时触发
            if (this.crt === (this.length - 1) * this.page) {
              this.page--
              this.$emit('updateItemPosition', {
                next: false,
                min: this.crt + 1,
                max: this.crt + this.length - 1,
                dIndex: this.length,
                swiperPosition: this.position,
              })
            }
          }
        }
      },

      // 位置更正
      reset()
      {
        this.enableTransition = true;
        this.updatePosition(0)
      },

      onLeave()
      {
        // 拖动出界自动判断需要触发哪种事件
        if (!this.autoTimer && !this.pending) {
          this.reset()
        }
        this.dt = 0
      },
      // 参数dt是相对于当前位置的移动量, this.position是当前滑块的位置
      updatePosition(dt)
      {
        // dt = (this.position + dt) % (this.size * this.length)
        dt = this.position + dt
        this.dragHandlerStyle = {
          transform: this.direction === 'horizontal' ? `translateX(${dt}px)` : `translateY(${dt}px)`,
          transition: this.enableTransition ? `transform ${this.duration / 1000}s` : ''
        }
      },

      startAutoPlay()
      {
        if (this.autoplay && this.length > 1) {
          clearInterval(this.autoTimer)
          this.autoTimer = setInterval(() =>
          {
            // 自动换下一页
            this.dt = -1
            // 平滑过渡
            this.gesture = this.initCurrent
            this.loopFix()
            this.next()

          }, this.interval);
        }
      },

      stopAutoPlay()
      {
        clearInterval(this.autoTimer)
        this.autoTimer = null
      },

      onTransitionEnd()
      {
        this.dt = 0
        if (!this.autoTimer && this.autoplay) {
          this.startAutoPlay()
        }
      },
    }
  }
</script>

<style lang='scss'>
  .component-swiper-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;

    .cpt-swiper-drag-handler {
      width: 100%;
      height: 100%;
    }

    .component-swiper-transition {
      transition: transform 0s;
    }

    .cpt-swiper-pagination-wrapper {
      position: absolute;
      z-index: 10;
      left: 50%;
      bottom: 10px;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      justify-content: space-around;

      .cpt-swiper-pagination-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: yellow;
        margin-right: 6px;

        &:last-child {
          margin: 0;
        }
      }
    }
  }
</style>