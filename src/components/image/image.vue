<template>
  <div @click="onClick" class="component-image-wrapper"
    :style="{width: enablePropWidth?propWidth:undefined, height: enablePropHeight?propHeight:undefined, fontSize: fontIconSize+'px' }">
    <div class="cpt-image-view-body">
      <!-- 路径图片 -->
      <img v-if="src" :style="{width: imgWidth, height: imgHeight }" :src="imgSrc" alt=""
        @dragstart.prevent="captureDrag">
      <!-- 字体图片 -->
      <span v-else :class="['font-src-default', fontSrc]"></span>
      <!-- 加载错误 -->
      <span v-if="fail" class="ict ictupianjiazaishibai image-error-placeholder"></span>
    </div>
    <!-- 加载中 -->
    <div v-if="shouldShowCover" class="image-loading-cover">
      <div class="ict icloading loading-animation"></div>
      <div v-if="fontIconSize>16" style="margin-top: 10px;font-size: 12px;">loading...</div>
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
    props: {
      src: {
        type: String,
        default: null,
      },
      mode: {
        type: String,
        default: 'scaleFill',
        validator(m)
        {
          return ['scaleFill', 'aspectFit', 'aspectFill', 'widthFix'].indexOf(m) !== -1
        }
      },
      width: {
        type: [Number, String],
        default: 20
      },
      height: {
        type: [Number, String],
        default: 20
      },

      fontSrc: {
        type: String,
        default: ''
      },
      ifLoading: {
        type: Boolean,
        default: true
      }
    },

    watch: {
      src: {
        immediate: true,
        handler(s)
        {
          this.init(s)
        },
      },

      ifLoading(ld)
      {
        this.loading = ld
        if (ld) {
          this.waitTimeout()
        }
      },
    },

    data()
    {
      return {
        imgWidth: '100%',
        imgHeight: '100%',
        loaded: false,
        loading: true,
        fail: false,
        tryTimer: null,
        imgSrc: '',
        imgObj: null,
        enablePropWidth: true,
        enablePropHeight: true,
      }
    },

    computed: {
      propWidth()
      {
        return unitFix(this.width)
      },
      propHeight()
      {
        return unitFix(this.height)
      },
      shouldShowCover()
      {
        return this.loading
      },
      fontIconSize()
      {
        let fs = (Math.min(200, parseInt(this.width) + parseInt(this.height)) / 200) * 30;
        return Math.max(14, fs)
      }
    },

    created()
    {
      window.addEventListener('online', this.init)
      window.addEventListener('offline', this.retry)
    },

    destroyed()
    {
      window.removeEventListener('online', this.init)
      window.removeEventListener('offline', this.retry)
    },

    methods: {
      captureDrag(e)
      {
        // e.preventDefault();
        return false;
      },
      waitTimeout()
      {
        setTimeout(() =>
        {
          if (!this.loaded) {
            this.loading = false
            this.fail = true
          }
        }, 100000);
      },

      retry()
      {
        if (!this.loaded) {
          this.loading = true
          clearInterval(this.tryTimer)
          // 超时处理，5秒间隔保证图片有充足的处理时间
          let tryTimes = 2; // 最大尝试次数
          this.tryTimer = setInterval(() =>
          {
            tryTimes--
            if (tryTimes < 0) {
              // 尝试次数用完，直接加载失败
              return this.onFail()
            }
            // 重新刷新图片引用
            this.imgObj.src = undefined
            this.$nextTick(() =>
            {
              this.imgObj.src = this.src
            })
          }, 5000);
        }
      },

      init(src)
      {
        if (this.loaded) {
          return
        }
        this.loading = this.ifLoading
        this.waitTimeout()

        // image对象用来获取原图的尺寸
        if (src) {
          this.imgSrc = src
          // 以下模式不需要原图信息
          if ('scaleFill | widthFix | heightFix'.indexOf(this.mode) !== -1) {
            switch (this.mode) {
              case 'widthFix': {
                this.imgWidth = '100%';
                this.imgHeight = undefined
                this.enablePropHeight = false
              }; break;
              case 'heightFix': {
                this.imgWidth = '100%';
                this.imgHeight = undefined
                this.enablePropWidth = false
              }
            }
            return this.onSuccess()
          }

          // image对象用于获取原图尺寸
          this.imgObj = new Image()
          this.imgObj.onload = () =>
          {
            let parentW = this.$el.offsetWidth, parentH = this.$el.offsetHeight;
            let max = Math.max(this.imgObj.width, this.imgObj.height), min = Math.min(this.imgObj.width, this.imgObj.height);
            let ratioW = 1, ratioH = 1, ratio = 1;
            ratioW = this.imgObj.width / parentW
            ratioH = this.imgObj.height / parentH

            switch (this.mode) {
              // 保持原图比例，最大边完全显示
              case 'aspectFit': {
                ratio = Math.max(ratioW, ratioH)
                this.imgWidth = this.imgObj.width / ratio + 'px'
                this.imgHeight = this.imgObj.height / ratio + 'px'

              }; break;
              // 按照原图比例缩放，最小边完全显示
              case 'aspectFill': {
                ratio = Math.min(ratioW, ratioH)
                this.imgWidth = this.imgObj.width / ratio + 'px'
                this.imgHeight = this.imgObj.height / ratio + 'px'
              }; break;
            }
            // 获取尺寸成功，销毁对象
            this.onSuccess()
          }

          this.imgObj.onerror = this.onFail
          this.imgObj.src = src

        } else if (this.fontSrc) {
          this.onSuccess()

        } else {
          this.onFail()
        }
      },

      onSuccess()
      {
        // console.log('加载成功', this.imgSrc)
        // 成功加载后不再加载
        clearInterval(this.tryTimer)
        this.loading = false
        this.imgObj = null
        this.imgSrc = undefined
        this.$nextTick(() =>
        {
          this.imgSrc = this.src
          this.loaded = true
          this.fail = false
        })
      },

      onFail()
      {
        // 失败后重试一次，若还是失败则当前状态切换为失败
        if (!this.loaded) {
          if (this.src && !this.tryTimer) {
            this.retry()
          } else {
            clearInterval(this.tryTimer)
            this.tryTimer = null
            this.loaded = false
            this.loading = this.ifLoading
            this.imgObj = null
            this.fail = !this.ifLoading
          }
        }
      },

      onClick(e)
      {
        this.$emit('click', e)
      }
    }
  }
</script>

<style lang='scss' scoped>
  .component-image-wrapper {
    overflow: hidden;
    position: relative;

    /* 图片加载中过渡效果 */
    @keyframes load-action {

      0%,
      100% {
        background-color: rgba($color: #fff, $alpha: 0.64);
      }

      50% {
        background-color: rgba($color: #fff, $alpha: 0.4);
      }
    }

    .img-loading {
      animation: load-action 2s infinite;
    }

    @keyframes loading {
      0% {
        transform: rotate(0);
        opacity: 0.64;
      }

      50% {
        opacity: 1;
      }

      100% {
        transform: rotate(360deg);
        opacity: 0.64;
      }
    }

    .image-loading-cover {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      /* mix-blend-mode: soft-light; */
      /* transition: background-color 0.32s ease-in-out; */
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .loading-animation {
        font-size: inherit;
        animation: loading 3s ease-in-out infinite;
      }
    }

    .image-error-placeholder {
      position: absolute;
      left: 50%;
      top: 50%;
      font-size: inherit;
      transform: translate(-50%, -50%);
    }

    .cpt-image-view-body {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>