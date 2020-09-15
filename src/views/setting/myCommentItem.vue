<template>
  <div class="mine-comment-item-wrapper" @click="toDetail">
    <div class="mine-comment-left">
      <input class="at-item-checkbox" type="checkbox" :checked="checkStatus" name="commentItem" :value="checkStatus"
        @click.stop="()=>{}" @change="onCheckChange">
      <ximage class="cmt-user-avatar" :src="user&&user.avatar" width="24" height="24" mode="aspectFill"></ximage>
      <div class="comment-title text-overflow-1">{{item&&item.content}}</div>
    </div>
    <div class="comment-info-detail">
      <span class="mine-at-date">{{getDate}}</span>
      <span class="mine-at-num">
        <span class="ict icdianzan1 at-like"></span>
        <span>{{item&&item.like_num}}</span>
      </span>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'myCommentItem',
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
    computed: mapState({
      user: 'user',
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
    }),
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
  .at-item-checkbox {
    width: 22px;
    height: 22px;
    margin-right: 10px;
    -webkit-appearance: checkbox;
  }

  .mine-comment-item-wrapper {
    display: flex;
    justify-content: space-between;
    padding: 10px;

    .mine-comment-left {
      display: flex;
    }

    .cmt-user-avatar {
      border-radius: 50%;
    }

    .comment-title {
      margin-left: 10px;
    }

    .comment-info-detail {
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