<template>
  <div class="comment-item-wrapper" @click.stop="()=>showInput=!showInput">
    <div class="comment-item-user">
      <ximage v-if="item&&item.user" class="comment-user-avatar" width="24" height="24" mode="aspectFill"
        :src="item.user.avatar">
      </ximage>
      <div v-else class="ict ictouxiang2 comment-user-avatar-place"></div>
      <div class="comment-user-info">
        <!-- 用户信息 -->
        <div class="comment-user-i-head">
          <span class="comment-user-name">{{item&&item.user.nickname||'匿名用户'}}</span>
          <span v-if="item&&item.to" class="comment-response-to">
            <span style="margin: 0 6px;font-size: 12px;">回复</span>
            <b class="comment-user-name">{{item&&item.to.nickname||'匿名用户'}}：</b>
          </span>
        </div>
        <!-- 评论内容 -->
        <div class="comment-item-content-body">
          <pre class="comment-item-content">{{item&&item.content}}<span class="item-date">{{parseDate}}</span></pre>
        </div>
      </div>
    </div>
    <!-- 用户回复该评论的发表者 -->
    <response-input :show.sync="showInput" :parent="parent" :articleId="articleId"
      :responseToId="item&&item.user.user_id" @confirm="onConfirmResponse">
    </response-input>
  </div>
  </div>
</template>

<script>
  import responseInput from './responseInput'
  export default {
    name: 'commentItem',
    components: {
      responseInput
    },
    props: {
      // 当前评论对象
      item: {
        type: Object,
        default: function ()
        {
          return {}
        }
      },
      // 所属文章id
      articleId: {
        type: [String, Number],
        default: null
      },
      // 回复评论的id
      parent: {
        type: Object,
        default: function ()
        {
          return null
        }
      },
    },
    computed: {
      parseDate()
      {
        let time = this.item.create_at * 1000, date = '刚刚';
        let current = new Date().getTime();
        let c = current - time;
        if (c > 2 * 24 * 3600000) {
          date = doget.time(parseInt(time)).format('xxxx-xx-xx')
        } else if (c > 24 * 3600000) {
          date = `${parseInt(c / (24 * 3600000))}天前`
        } else if (c > 3600000) {
          date = `${parseInt(c / 3600000)}小时前`
        } else if (c > 60000) {
          date = `${parseInt(c / 60000)}分钟前`
        }
        return date;
      }
    },
    data()
    {
      return {
        showInput: false,
      }
    },

    methods: {
      onConfirmResponse(data)
      {
        this.$emit('addComment', data)
      }
    }
  }
</script>

<style lang='scss'>
  .comment-item-wrapper {
    padding-bottom: 10px;
    max-width: 720px;
    font-size: 14px;

    &:last-child {
      .comment-item-content-body {
        border: none !important;
      }
    }

    .comment-user-name {
      display: inline-block;
    }

    .comment-item-user {
      display: flex;
      margin-right: 10px;

      .comment-user-avatar {
        flex-shrink: 0;
        border: 1px solid #dcdcdc;
      }

      .comment-user-avatar-place {
        font-size: 18px;
        margin-right: 10px;
        color: #666;
      }

      .comment-user-info {
        width: 100%;

        .comment-user-i-head {
          font-size: 13px;
          margin-bottom: 6px;

          .comment-response-to {
            white-space: nowrap;
          }

        }

        .comment-item-content-body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding-bottom: 10px;
          /* border-bottom: 1px solid #e8e8e8; */

          .comment-op-item {
            display: flex;
            align-items: center;
            font-size: 12px;
            color: #5a6d96;

            &:first-child {
              margin-right: 20px;
            }

            .cmt-op-icon {
              font-size: 16px;
              margin-right: 4px;
            }

            span {
              white-space: nowrap;
            }
          }

          .comment-item-content {
            flex: 4 1 auto;
            white-space: pre-wrap;
          }

          .item-date {
            margin-left: 10px;
            font-size: 12px;
            color: #989898;
          }
        }
      }
    }
  }
</style>