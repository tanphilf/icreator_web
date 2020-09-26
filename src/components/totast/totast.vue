<template>
  <div @animationend="onTransEnd"
    :class="['component-totast-wrapper', show?'cpt-totast-show':'',content&&!show?'cpt-totast-hide':'']">
    <div class="cpt-totast-box">
      <span :class="['ict',icon,'totast-icon']" :style="{color: iconColor}"></span>
      <span class="cpt-totast-content">{{content}}</span>
    </div>
  </div>
</template>

<script>
  const totastCfg = {
    default: {
      type: 'default',
      color: '#fcba16',
      icon: 'ichj1'
    },
    warn: {
      type: 'warn',
      color: '#fcba16',
      icon: 'ichj1'
    },
    success: {
      type: 'success',
      color: '#42be5c',
      icon: 'iczhengque'
    },
    fail: {
      type: 'fail',
      color: '#878787',
      icon: 'icerror'
    },
  }
  export default {
    name: 'totast',
    props: {
    },
    data()
    {
      return {
        content: '',
        show: false,
        type: totastCfg.default.type,
        showDelay: false,
        icon: totastCfg.default.icon,
        iconColor: totastCfg.default.color,
        timer: null
      }
    },
    created()
    {
      this.$root.$on('showToast', this.onTotast)
    },
    destroyed()
    {
      this.$root.$off('showToast', this.onTotast)
    },
    methods: {
      onTransEnd()
      {
        if (!this.show) {
          this.reset()
        }
      },
      reset()
      {
        this.type = 'default';
        this.iconColor = totastCfg[this.type].color
        this.icon = totastCfg[this.type].icon
      },
      onTotast(cfg)
      {
        if (cfg) {
          this.content = cfg.content;
          if (['default', 'success', 'warn', 'fail'].indexOf(cfg.type) !== -1) {
            this.type = cfg.type;
            this.iconColor = totastCfg[this.type].color
            this.icon = totastCfg[this.type].icon
          }
          this.show = true

          clearTimeout(this.timer);
          this.timer = setTimeout(() =>
          {
            this.show = false
          }, 1800);
        }
      }
    }
  }
</script>

<style lang='scss'>
  .component-totast-wrapper {
    position: fixed;
    z-index: -999;
    left: 50%;
    top: 50%;
    opacity: 0;
    transform: translate(-50%, -50%);
    background-color: #fcffe6;
    border-radius: 6px;
    padding: 10px;
    border: 1px solid #dcdcdc;

    .cpt-totast-delay-cover {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
    }

    .cpt-totast-box {
      display: flex;
      align-items: center;

      .totast-icon {
        margin-right: 6px;
      }
    }
  }

  .cpt-totast-show {
    z-index: 9999;
    opacity: 1;
    transition: opacity .36s ease-out;
  }

  @keyframes totastHide {
    0% {
      opacity: 1;
      z-index: 9999;
    }

    100% {
      opacity: 0;
      z-index: -9999;
    }
  }

  .cpt-totast-hide {
    animation: totastHide .36s ease-in;
  }
</style>