<template>
  <div @focus="onFocus" @blur="onBlur" @touchstart="onTouchStart" @dblclick="onDblClick" @click="onClick"
    @touchmove="onTouchMove" @touchend="onTouchEnd" @mousedown="onMouseDown" @mouseup="onTouchEnd"
    @mouseleave="onMouseLeave" @mouseenter="onMouseEnter" @mousemove="onMouseMove" @contextmenu="onContextMenu"
    :class="[hover?hoverClass: '']">
    <slot></slot>
  </div>
</template>

<script>

  export default {
    props: {
      hoverClass: {
        type: String,
        default: ''
      },
    },

    data()
    {
      return {
        hover: false,
        clickTimer: null
      }
    },

    methods: {
      onFocus(e)
      {
        this.$emit('focus', e)
      },
      onBlur(e)
      {
        this.$emit('blur', e)
      },
      onTouchStart(e)
      {
        this.$emit('touchStart', e)
      },
      onTouchMove(e)
      {
        setTimeout(() =>
        {
          this.$emit('move', e)
        }, 20)
      },
      onTouchEnd(e)
      {
        this.$emit('touchEnd', e)
      },

      onContextMenu(e)
      {
        e = e || window.event
        e.preventDefault();
        this.$emit('contextMenu', e)
      },

      // dbclick事件和click冲突，dbclick会触发一次click
      onClick(e)
      {
        clearTimeout(this.clickTimer)
        this.$emit('click', e)
      },

      onDblClick(e)
      {
        clearTimeout(this.clickTimer)
        this.$emit('dbclick', e)
      },

      onMouseDown(e)
      {
        this.$emit('pressDown', e)
      },

      onMouseEnter(e)
      {
        this.hover = true
        this.$emit('enter', e)
      },

      onMouseMove(e)
      {
        setTimeout(() =>
        {
          this.$emit('move', e)
        }, 50)
      },

      onMouseLeave(e)
      {
        this.hover = false
        this.$emit('leave', e)
      },

    },
  }
</script>