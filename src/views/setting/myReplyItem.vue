<template>
  <div class="mine-reply-item-wrapper" @click="toDetail">
    <div class="mine-reply-left">
      <input class="at-item-checkbox" type="checkbox" :checked="checkStatus" name="commentItem" :value="item.comment_id"
        @click.stop="()=>{}" @change="onCheckChange">
      <ximage class="cmt-user-avatar" :src="item&&item.user.avatar" width="24" height="24" mode="aspectFill"></ximage>
      <div class="reply-info">
        <div class="reply-name text-overflow-1">{{item&&item.user&&item.user.nickname}}</div>
        <div class="reply-content text-overflow-2">{{item&&item.content}}</div>
      </div>
    </div>
    <div class="reply-info-detail">
      <span class="mine-at-date">{{getDate}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'myReplyItem',
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
          id: this.item.comment_id
        })
      }
    }
  }
</script>

<style lang='scss'>
  .mine-reply-item-wrapper {
    display: flex;
    justify-content: space-between;
    padding: 10px;

    .mine-reply-left {
      display: flex;
    }

    .reply-info {
      margin-left: 10px;

      .reply-name {
        font-size: 12px;
        color: #5a6d96;
      }

      .reply-content {}
    }

    .at-item-checkbox {
      width: 22px;
      height: 22px;
      margin-right: 10px;
      -webkit-appearance: checkbox;
    }

    .cmt-user-avatar {
      border-radius: 50%;
    }

    .reply-info-detail {
      .mine-at-date {
        font-size: 12px;
        color: #989898;
      }

      .mine-at-num {
        margin-left: 10px;

        .at-like {
          font-size: 14px;
          color: #666;
          margin-right: 4px;
        }
      }
    }
  }
</style>