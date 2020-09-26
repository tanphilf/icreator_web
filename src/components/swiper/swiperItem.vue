<template>
  <div class="component-swiper-item-wrapper" @mousedown="onPressDown" @mouseleave="reset" @mouseup="calc"
    @mousemove="onPressMove" @touchstart.stop.prevent="onTouchStart" @touchmove="onTouchMove" @touchend="calc"
    :style="statusStyle">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'swiperItem',
    props: {
      index: {
        type: [String, Number],
        default: null,
        required: true
      },
    },
    data()
    {
      return {
        size: 0,
        start: null,
        current: -1,
        position: 0,
        tranStyle: {},
        isHorizontal: true,
        currentIndex: 0, // loop替补时的有效Index
        direction: 'horizontal',
        duration: 500,
        gesture: false,
        statusStyle: {},
        timer: null
      }
    },

    mounted()
    {
      this.direction = this.$parent.direction
      this.duration = this.$parent.duration
      this.currentIndex = this.index;
      this.isHorizontal = this.direction === 'horizontal'
      this.$nextTick(this.initDt)

      this.$parent.$on('updateItemPosition', this.updatePosition)
      window.addEventListener("orientationchange" in window ? "orientationchange" : "resize", this.initDt, false)
    },

    destroyed()
    {
      this.$parent.$off('updateItemPosition', this.updatePosition)
      window.removeEventListener("orientationchange" in window ? "orientationchange" : "resize", this.initDt, false)
    },

    methods: {
      // 需要loop替补时监听事件，同步自身位置
      updatePosition(detail)
      {
        let {
          next,
          max,
          min,
          dIndex,
          swiperPosition
        } = detail

        this.current = this.$parent.crt

        // 需要重新移动的范围item，向后替补自身index需要加上总item个数长度，向前替补则相反
        if (this.currentIndex >= min && this.currentIndex <= max) {
          this.currentIndex += next ? dIndex : -dIndex;
          // swiperPosition + 当前item偏移量 = 0，当前相对于current就是在swiperPosition基础上加上index差距的值
          this.initDt(-swiperPosition)
        }
      },

      // 排列child位置（需要保证所有child尺寸相同）
      initDt(dt = 0)
      {
        this.size = this.$parent.size
        this.current = this.$parent.crt
        this.position = dt + this.size * (this.currentIndex - this.current)
        // 手动拖动以及自动播放区分，手动拖动（过程只是刷新位置没有触发next或者before）不需要延迟位移其他item
        let isGesture = typeof (this.$parent.getGestureIndex()) === 'number'
        this.statusStyle = {
          zIndex: this.currentIndex === this.current ? 999 : this.index,
          transform: this.isHorizontal ? `translateX(${this.position}px)` : `translateY(${this.position}px)`,
          transition: `transform 0s ${isGesture ? 0 : this.duration / 1000}s`
        }
      },

      reset()
      {
        this.start = null
        this.gesture = false
      },

      onPressDown(e)
      {
        this.gesture = true
        this.start = this.isHorizontal ? e.screenX : e.screenY
        this.$parent.setGestureIndex(this.currentIndex)
      },
      onPressMove(e)
      {
        if (this.gesture) {
          this.dt = (this.isHorizontal ? e.screenX : e.screenY) - this.start
          this.$parent.$emit('positionChange', this.dt)
        }
      },
      onTouchStart(e)
      {
        e = e || window.event
        e.preventDefault();
        this.gesture = true
        this.start = this.isHorizontal ? e.touches[0].clientX : e.touches[0].clientY
        this.$parent.setGestureIndex(this.currentIndex)
      },

      onTouchMove(e)
      {
        if (this.gesture) {
          this.dt = (this.isHorizontal ? e.touches[0].clientX : e.touches[0].clientY) - this.start
          this.$parent.$emit('positionChange', this.dt)
        }
      },

      calc(e)
      {
        if (!this.dt) {
          return this.$emit('click', e);
        }
        if (this.dt < -80) {
          this.$parent.next()

        } else if (this.dt > 80) {
          this.$parent.before()

        } else {
          this.$parent.reset()
        }
        this.gesture = false
        this.start = null
        this.$parent.setGestureIndex(null)
      },

      onTouchEnd(e)
      {
        this.calc()
      },

      onTransitionEnd()
      {
        this.start = null
      }
    }
  }
</script>

<style lang='scss'>
  .component-swiper-item-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>