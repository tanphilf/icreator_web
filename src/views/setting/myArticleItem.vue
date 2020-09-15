<template>
  <div class="mine-article-item-wrapper" @click="toDetail">
    <div class="mine-article-left">
      <input class="at-item-checkbox" type="checkbox" :checked="checkStatus" name="articleItem" :value="item.article_id"
        @click.stop="()=>{}" @change="onCheckChange">
      <ximage v-if="item&&item.cover" :src="item.cover" width="24" height="24" mode="aspectFill"></ximage>
      <div v-else class="ict icrementupian"></div>
      <div class="article-info">
        <div class="article-title text-overflow-1" :title="item.title||''">{{item&&item.title}}</div>
        <span class="mine-at-date">{{getDate}}</span>
      </div>
    </div>
    <div class="article-info-detail">
      <span class="mine-at-num">
        <span class="ict ichot3 at-hot"></span>
        <span>{{item&&item.view_num}}</span>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'myArticleItem',
    props: {
      checked: {
        type: Boolean,
        default: false
      },
      item: {
        required: true,
        type: Object,
        default: function ()
        {
          return null
        }
      }
    },
    computed: {
      getDate()
      {
        let time = this.item.create_at * 1000
        let current = new Date().getTime();
        let date = '现在';
        let c = current - time;
        if (c > 2 * 24 * 3600000) {
          date = doget.time(parseInt(time)).format('xxxx-xx-xx')
        } else if (c > 24 * 3600000) {
          date = '1天前'
        } else if (c > 3 * 3600000) {
          date = `${parseInt(c / 3600000)}小时前`
        } else if (c > 30 * 60000) {
          date = '30分钟前'
        } else if (c > 60) {
          date = `${parseInt(c / 60000)}分钟前`
        } else {
          date = '现在'
        }
        return date;
      }
    },
    watch: {
      checked: {
        immediate: true,
        handler(c)
        {
          this.checkStatus = c
        }
      }
    },
    data()
    {
      return {
        checkStatus: false
      }
    },

    methods: {
      toDetail()
      {
        let url = this.$router.resolve({
          path: '/detail/' + this.item.article_id
        })
        window.open(url.href, "_blank")
      },
      onCheckChange()
      {
        this.checkStatus = !this.checkStatus
        this.$emit('change', {
          checked: this.checkStatus,
          id: this.item.article_id
        })
      }
    }
  }
</script>

<style lang='scss'>
  .mine-article-item-wrapper {
    display: flex;
    justify-content: space-between;
    padding: 10px;

    .mine-article-left {
      display: flex;
      align-items: center;
      position: relative;
    }

    .at-item-checkbox {
      width: 22px;
      height: 22px;
      margin-right: 10px;
      -webkit-appearance: checkbox;
    }

    .article-info {
      margin-left: 10px;
    }

    .mine-at-date {
      font-size: 12px;
      color: #989898;
    }

    .article-title {
      max-width: 210px;
    }

    .article-info-detail {
      .mine-at-num {
        margin-left: 10px;

        .at-hot {
          font-size: 12px;
          color: red;
          margin-right: 4px;
        }
      }
    }
  }
</style>