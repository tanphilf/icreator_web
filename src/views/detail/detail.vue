<template>
  <div>
    <head-nav></head-nav>
    <div :class="['article-detail-wrapper container']">
      <div v-if="articleData.cover" class="article-cover-wrapper">
        <ximage class="article-cover" :src="articleData.cover" width="100%" mode="aspectFill"></ximage>
      </div>
      <div class="article-description">
        <h1 class="article-title text-overflow-2" :title="articleData.title">{{articleData.title}}</h1>
        <div v-if="articleData.user" class="article-author">
          <ximage class="author-avatar" :src="articleData.user.avatar" width="30" height="30" mode="aspectFill">
          </ximage>
          <div class="author-info">
            <div class="author-info-left">
              <span class="author-info-head text-overflow-1">
                <span class="author-name">{{articleData.user.nickname}}</span>
                <span class="focus-btn">关注</span>
              </span>
              <p class="article-create-date">
                <span style="margin-right: 6px;">最后修改:</span>
                <span>{{articleData.create_time}}</span>
              </p>
            </div>
            <div class="author-info-right">

            </div>
          </div>
        </div>
      </div>
      <!-- 文章内容 -->
      <div class="article-content" v-html="articleData.content"></div>
      <!-- 发布点评 -->
      <div class="article-comment-publish-wrapper">
        <h3 class="comment-head">我要点评</h3>
        <textarea @input="onInputComment" class="" maxlength="500" :value="commentContent"></textarea>
        <div class="comment-btn-group">
          <span class="comment-num-tip">还可以输入 <em class="comment-num">{{500-commentContent.length}}</em> 字</span>
          <span @click="onPublishComment" class="confirm-btn">点评</span>
        </div>
      </div>
      <!-- 评论列表 -->
      <div class="article-comments">
        <h3 class="comment-head">精彩评论</h3>
        <ul class="article-comment-list">
          <li v-for="(comment, i) in commentList" :key="comment&&comment.comment_id" class="article-comment-item">
            <ximage v-if="comment.user&&comment.user.avatar" class="comment-user-avatar" width="42" height="42"
              mode="aspectFill" :src="comment.user.avatar"></ximage>
            <div v-else class="ict ictouxiang2 comment-avatar-place"></div>
            <!-- 评论body信息 -->
            <div class="article-comment-body">
              <span class="comment-user-name">
                <span>{{comment.user&&comment.user.nickname||'已注销'}}</span>
                <span class="comment-create-time">{{comment.date}}</span>
              </span>

              <pre class="comment-content">{{comment.content}}</pre>
              <!-- 底部操作按钮 -->
              <div class="comment-operation">
                <ul>
                  <li class="comment-op-item" @click="addLike(comment.comment_id,i)">
                    <span class="ict icdianzan1 cmt-op-icon"></span>
                    <span>{{comment.like_num||0}}</span>
                  </li>
                  <li @click="onResponseComment(i)" class="comment-op-item">
                    <span class="ict icpinglun1 cmt-op-icon"></span>
                    <span>{{comment.list&&comment.list.length}}</span>
                  </li>
                </ul>
              </div>

              <!-- 不需要reponseToId，表示只回复当前评论 -->
              <response-input :show="comment.showInput" :parent="comment" :articleId="articleData.article_id"
                :responseToId="comment.user.user_id" @confirm="(d)=>onConfirmComment(d,i)">
              </response-input>

              <!-- 回复讨论列表 -->
              <div v-if="comment.list&&comment.list.length" class="comment-replay-list">
                <comment-item v-for="(item,index) in comment.list" :parent="comment" :articleId="articleData.article_id"
                  :item="item" @addComment="(d)=>onAddResponseComment(d,i)" :key="item&&item.comment_id">
                </comment-item>
              </div>
            </div>
          </li>
          <li v-if="commentList.length===0" class="comment-none-place">沙发上空无一人。</li>
          <li v-else class="load-more">
            <div v-if="loadAll">没有更多了</div>
            <div v-else @click="onLoadMore">加载更多</div>
          </li>
        </ul>
      </div>
    </div>
    <bottom-footer></bottom-footer>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import commentItem from './commentItem'
  import responseInput from './responseInput'

  export default {
    name: 'detail',
    components: {
      commentItem,
      responseInput
    },
    props: {},
    computed: mapState(['showNav']),
    data()
    {
      return {
        articleData: {},
        commentContent: '',
        commentList: [],
        commentPage: 1,
        commentIptIndex: -1,
        loadAll: false,
      }
    },
    created()
    {
      let params = this.$route.params
      if (params) {
        let { id } = params
        if (id) {
          this.getArticleDetail(id)
          this.getCommentList(id)
        }
      }
    },

    methods: {
      // 输入文章评论内容
      onInputComment(e)
      {
        this.commentContent = e.target.value
      },

      // 回复一级评论
      onResponseComment(current)
      {
        this.$set(this.commentList[current], 'showInput', !this.commentList[current].showInput)
      },

      // 参与回复列表讨论，添加一条记录
      onAddResponseComment(d, cmtIndex)
      {
        this.$set(this.commentList[cmtIndex], 'showInput', false)
        if (!d) {
          return
        }
        let ls = this.commentList[cmtIndex].list;
        ls = ls || [];
        ls.unshift(d)
        this.$set(this.commentList[cmtIndex], 'list', ls)
      },
      // 回复一级评论（没有to用户对象，只是针对文章）
      onConfirmComment(data, current)
      {
        this.$set(this.commentList[current], 'showInput', false)
        if (!data) {
          return
        }
        data.to = null
        this.onAddResponseComment(data, current)
      },

      getArticleDetail(aid)
      {
        this.$http.get('/article/getDetail', {
          id: aid
        }).then(res =>
        {
          let { code, data } = res.data
          if (code === 200) {
            data.create_time = doget.time(data.create_at * 1000).format()
            this.articleData = data
            document.title = data.title
          }
        })
      },

      parseDate(create_at)
      {
        let time = create_at * 1000, date = '刚刚';
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
      },

      getCommentList(aid)
      {
        this.$http.get('/comment/getListFromArticle', {
          article_id: aid,
          page: this.commentPage,
          pageSize: 10
        }).then(res =>
        {
          let { code, data } = res.data
          console.log('文章评论列表：', data)
          if (code == 200) {
            if (data.length) {
              data.forEach(c =>
              {
                c.date = this.parseDate(c.create_at);
              });
              this.commentList = this.commentPage > 1 ? [...this.commentList, ...data] : data
              this.loadAll = data.length < 10

            } else {
              this.loadAll = true
            }
          }
        })
      },

      onLoadMore()
      {
        this.commentPage++
        this.getCommentList(this.articleData.article_id)
      },

      onPublishComment()
      {
        if (!this.commentContent) {
          return UI.showToast({
            content: '请输入评论内容'
          })
        }
        let user = gStatus.userData;
        if (!user.nickname) {
          return UI.showToast({
            content: '请登陆后再评论'
          })
        }

        this.$http.post('/comment/add', {
          token: gStatus.getToken(),
          article_id: this.articleData.article_id,
          content: this.commentContent
        }).then(res =>
        {
          let { code, msg, data } = res.data
          console.log('评论返回：', data);
          if (code == 200) {
            UI.showToast({
              content: '评论成功',
              type: 'success'
            })
            Object.assign(data, {
              content: this.commentContent,
              user: gStatus.userData,
              date: this.parseDate(data.create_at)
            })
            this.commentList.unshift(data)
            this.commentContent = ''
          } else {
            UI.showToast({
              content: msg,
            })
          }
        })
      },

      addLike(cmtId, index)
      {
        if (cmtId) {
          this.$http.post('/comment/addLike', {
            comment_id: cmtId,
          }).then(res =>
          {
            console.log('点赞返回：', res)
            let { code, msg, data } = res.data
            if (code == 200) {
              this.$set(this.commentList[index], 'like_num', data.like_num)
            }
          })
        }
      }
    }
  }
</script>

<style lang='scss'>
  h1 {
    font-size: 28px;
  }

  .load-more {
    width: 80px;
    text-align: center;
    border-radius: 8px;
    margin: 20px auto;
    cursor: pointer;
    font-size: 12px;
    color: #989898;
  }

  .comment-head {
    color: #5a6d96;
    font-weight: 600;
    padding: 20px 0;
  }

  .article-detail-wrapper {
    padding: 10px 0;

    .article-content,
    .article-comments {
      background-color: white;
      padding: 10px 20px;
      border-radius: 4px;
      min-height: 2.2rem;
      font-size: 16px;
    }

    .article-cover-wrapper {
      background-color: white;
      padding: 20px 10px;

      .article-cover {
        min-height: 320px;
        max-height: 420px;
      }
    }

    .article-description {
      background-color: white;
      padding: 30px 25px 26px 25px;

      .article-author {
        display: flex;

        .author-avatar {
          border: 1px solid #5a6d96;
          border-radius: 50%;
        }

        .author-info {
          display: flex;
          width: 100%;
          max-width: 640px;
          justify-content: space-between;
          margin-left: 10px;

          .author-info-left {
            .author-info-head {
              .author-name {
                font-weight: 600;
                font-size: 13px;
                max-width: 320px;
              }

              .focus-btn {
                border: 1px solid #81ba5a;
                border-radius: 3px;
                color: #81ba5a;
                padding: 2px 4px;
                margin-left: 10px;
                font-size: 10px;
                font-weight: 600;
              }
            }

            .article-create-date {
              margin-top: 6px;
              color: #676767;
            }
          }

          .author-info-right {}
        }
      }

      .article-title {
        font-weight: 600;
        padding: 10px 0;
        margin-bottom: 20px;
        max-width: 640px;
        border-bottom: 1px solid #f2f2f2;
      }
    }

    @media screen and (min-width: 676px) {
      .article-content {
        padding: 10px 40px !important;
      }
    }


    .article-content {
      line-height: 1.85;

      /* 富文本内容样式修正 */
      li,
      ul {
        list-style: disc outside none;
      }

      a {
        color: #2f54eb;
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-weight: 600;
        margin: 14px 0;
      }

      h2 {
        padding-bottom: 12px;
        font-size: 24px;
        border-bottom: 1px solid #ececec;
      }

      p {
        margin-top: 22px;
        margin-bottom: 22px;
      }

      img {
        max-width: 100%;
      }

      pre {
        white-space: pre-wrap;
        background-color: #f8f8f8;
        padding: 18px 15px 12px;
        border: 1px solid #dcdcdc;
      }

      blockquote {
        padding: 20px;
        background-color: #fafafa;
        border-left: 6px solid #e6e6e6;
        word-break: break-word;
        font-size: 16px;
        font-weight: normal;
        line-height: 30px;
        margin: 0 0 20px
      }
    }

    .article-comments {
      margin-top: 10px;
      padding-bottom: 40px;

      .article-comment-list {
        max-width: 840px;

        .article-comment-item {
          display: flex;
          margin-bottom: 20px;
          padding: 10px 0;
          /* border-bottom: 1px solid #f2f2f2; */

          &:last-child {
            border: none;
          }

          .comment-user-avatar {
            flex-shrink: 0;
            margin-right: 10px;
            background-color: #f2f2f2;
            border-radius: 50%;
          }

          .comment-avatar-place {
            font-size: 24px;
            margin-right: 10px;
            color: #666;
          }

          .article-comment-body {
            width: 100%;

            .comment-user-name {
              font-weight: 600;
              color: #5a6d96;
            }

            .comment-create-time {
              margin-left: 8px;
              font-size: 12px;
              color: #989898;
            }

            .comment-content {
              font-size: 16px;
              padding: 8px 0;
              white-space: pre-wrap;
            }

            .comment-operation {
              display: flex;
              width: 100%;
              color: #5a6d96;

              ul {
                display: flex;
                align-items: center;
                margin-left: auto;
              }

              .comment-op-item {
                display: flex;
                align-items: center;
                font-size: 12px;
                cursor: pointer;

                &:first-child {
                  margin-right: 20px;
                }

                .cmt-op-icon {
                  font-size: 18px;
                  margin-right: 4px;
                }
              }
            }

            .comment-replay-list {
              padding: 20px 6px 20px 14px;
              margin: 14px 0;
              /* width: 80%; */
              background-color: #f8f8f8;
              border-radius: 4px;
              border: 1px solid #f2f2f2;
            }
          }
        }

        .comment-none-place {
          text-align: center;
          font-size: 12px;
          color: #989898;
          padding: 20px 0;
        }
      }
    }

    .article-comment-publish-wrapper {
      padding: 80px 20px 10px 20px;
      background-color: white;

      textarea {
        font-size: 14px;
        border: 1px solid #dedede;
        width: 100%;
        height: 120px;
        padding: 10px;
      }

      .comment-btn-group {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 20px 0;
        width: 100%;
        padding-left: 10px;

        .confirm-btn {
          width: 80px;
          padding: 6px 20px;
          border-radius: 4px;
          margin-left: auto;
        }

        .comment-num-tip {
          color: #989898;

          .comment-num {
            color: red;
          }
        }
      }
    }
  }
</style>