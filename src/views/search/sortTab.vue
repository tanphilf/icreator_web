<template>
  <div class="sort-tab-wrapper" @mouseenter="()=>hover=true" @mouseleave="()=>hover=false" @click="onCheck">
    <span :class="[hover||checked?'active':'']">{{label}}</span>
    <span class="sort-arrow-box">
      <span :class="['ict icpaixu-shengxu', !desc&&checked?'arrow-active':'']"></span>
      <span :class="['ict icpaixu-jiangxu', desc&&checked?'arrow-active':'']"></span>
    </span>
  </div>
</template>

<script>
  export default {
    name: 'sortTab',
    props: {
      label: {
        type: String,
        default: ''
      },
      checked: {
        type: Boolean,
        type: false
      },
    },
    watch: {
      checked: {
        immediate: true,
        handler(c)
        {
          if (c) {
            this.desc = false
          }
        }
      }
    },
    data()
    {
      return {
        hover: false,
        // 是否降序
        desc: true
      }
    },

    methods: {
      onCheck()
      {
        this.desc = !this.desc
        this.$emit('change', this.desc)
      }
    }
  }
</script>

<style lang='scss'>
  .active {
    color: #2f54eb !important;
  }

  .sort-tab-wrapper {
    display: flex;
    align-items: center;
    font-size: 14px;
    cursor: pointer;

    .sort-arrow-box {
      height: 14px;
      width: 18px;
      margin-left: 6px;
      position: relative;
      margin-bottom: 4px;

      span {
        font-size: 18px;
        color: #898989;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        &:last-child {
          margin-top: 2px;
        }
      }

      .arrow-active {
        color: #2f54eb !important;
      }
    }
  }
</style>