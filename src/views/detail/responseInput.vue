<template>
  <div v-if="show" class="cmt-user-response-input" @click.stop="()=>{}">
    <span class="cmt-input-label"> 回复：</span>
    <input ref="commentInput" @input="onInputReply" @keyup.enter="confirmReply" class="cmt-input" type="text" autofocus
      :maxlength="maxLen">
    <span @click="confirmReply" class="ict icfasong icon-send"></span>
  </div>
</template>

<script>
  export default {
    name: 'responseInput',
    props: {
      show: {
        type: Boolean,
        default: false
      },
      parent: {
        type: Object,
        default: function ()
        {
          return null
        }
      },
      articleId: {
        type: [String, Number],
        default: null
      },
      // 回复用户的id
      responseToId: {
        type: [String, Number],
        default: null
      },
      maxLen: {
        type: [String, Number],
        default: 500
      }
    },
    data()
    {
      return {
        replyContent: '',
        token: '',
      }
    },

    created()
    {
      this.init()
    },

    mounted()
    {
      this.$nextTick(() =>
      {
        setTimeout(() =>
        {
          this.$refs.commentInput.focus()
        }, 1000);
      })
    },

    methods: {
      init()
      {
        this.token = gStatus.getToken()
        document.addEventListener('click', () =>
        {
          this.$emit('update:show', false)
        })
      },

      onInputReply(e)
      {
        this.replyContent = e.target.value
      },
      confirmReply()
      {
        if (!this.token) {
          this.$emit('confirm', null)
          return UI.showToast({
            content: '请先登陆后再评论'
          })
        }
        // if () { }
        console.log(gStatus.userData.user_id, this.responseToId)
        this.$http.post('/comment/add', {
          token: this.token,
          article_id: this.articleId,
          parent_id: this.parent.comment_id,
          response_to: this.responseToId,
          content: this.replyContent
        }).then(res =>
        {
          let { code, data, msg } = res.data
          if (code === 200) {
            this.$emit('confirm', Object.assign(data, {
              article_id: this.articleId,
              parent_id: this.parentId,
              response_to: this.responseToId,
              to: this.parent.user,
              content: this.replyContent,
              user: gStatus.userData
            }))
            UI.showToast({
              content: '评论成功',
              type: 'success'
            })
          } else {
            UI.showToast({
              content: msg
            })
          }
        })
        this.$emit('update:show', false)
      },
    }
  }
</script>

<style lang='scss'>
  .cmt-user-response-input {
    display: flex;
    align-items: center;
    margin: 30px 0;
    padding-right: 14px;

    input {
      flex: 3 2 auto;
      background-color: white;
      padding: 4px 10px;
      border: 1px solid #dcdcdc;
    }

    .cmt-input-label {
      font-size: 12px;
      margin-right: 8px;
      white-space: nowrap;
    }

    .icon-send {
      color: #989898;
      margin-left: 20px;
      cursor: pointer;
    }
  }
</style>