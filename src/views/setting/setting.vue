<template>
  <div class="setting-page-wrapper">
    <head-nav :show="showNav"></head-nav>
    <div :class="['setting-body container content-box',showNav?'nav-body-fix':'']">
      <div class="setting-left-menu">
        <!-- 用户简略信息 -->
        <div class="user-area">
          <div v-if="user&&user.nickname" class="flex-col-center">
            <ximage class="user-avatar" width="48" height="48" mode="aspectFill" :src="user.avatar">
            </ximage>
            <div class="user-nickname text-overflow-1" :title="user&&user.nickname">{{user.nickname}}</div>
          </div>
          <div v-else class="flex-col-center">
            <div class="ict ictouxiang2 user-avatar-place"></div>
            <div style="font-size: 14px;margin: 10px 0;white-space: nowrap;">未登陆</div>
          </div>
        </div>
        <!-- 操作菜单 -->
        <ul class="menu-list">
          <xview @click="onCheckMenu(0)" :class="['menu-item', checkedMenu===0?'menu-item-checked':'']"
            hoverClass="menu-item-hover">主页</xview>
          <xview @click="onCheckMenu(1)" :class="['menu-item', checkedMenu===1?'menu-item-checked':'']"
            hoverClass="menu-item-hover">资料</xview>
          <xview @click="onCheckMenu(2)" :class="['menu-item', checkedMenu===2?'menu-item-checked':'']"
            hoverClass="menu-item-hover">安全</xview>
          <xview @click="onCheckMenu(3)" :class="['menu-item', checkedMenu===3?'menu-item-checked':'']"
            hoverClass="menu-item-hover">其他</xview>
        </ul>
      </div>
      <!-- 菜单视图容器 -->
      <div class="setting-view-wrapper">
        <!-- 用户相关文章、评论等 -->
        <ul v-if="checkedMenu===0" class="menu-view-wrapper">
          <ul class="personal-nav">
            <li @click="onCheckNav(0)" :class="['personal-nav-item', currentNav===0?'personal-nav-item-checked':'']">
              我的作品</li>
            <li @click="onCheckNav(1)" :class="['personal-nav-item', currentNav===1?'personal-nav-item-checked':'']">
              我的评论</li>
            <li @click="onCheckNav(2)" :class="['personal-nav-item', currentNav===2?'personal-nav-item-checked':'']">回复
            </li>
          </ul>
          <form action="" @submit.prevent="onSubmitModify">
            <!-- 内容操作 -->
            <div class="item-operation-nav">
              <span class="flex-row-center">
                <input class="select-all-checkbox" type="checkbox" :checked="selectAll"
                  @change="()=>selectAll = !selectAll" @click.stop="()=>{}">
                <span style="white-space: nowrap;">全选</span>
              </span>
              <span class="item-operation-box">
                <div v-if="currentNav===0" :class="['operation-btn',selectAll?'disabled':'']" @click="onModify">
                  <span class="ict icxiugai07 icon"></span>
                  <span>修改</span>
                </div>
                <button v-if="currentNav!==2" class="operation-btn" type="submit">
                  <span class="ict icdelete icon"></span>
                  <span>删除</span>
                </button>
                <button v-if="currentNav===2" class="operation-btn" type="submit">
                  <span class="ict icyichu icon"></span>
                  <span>忽略</span>
                </button>
              </span>
            </div>
            <!-- 视图容器内容列表 -->
            <ul class="personal-item-list">
              <div v-if="currentNav===0">
                <article-item @change="onEditChange" v-for="(article,index) in articleList" :item="article"
                  :key="article.article_id" class="mine-article-item" :checked="selectAll">
                </article-item>
                <div v-if="!articleList.length" class="none-placeholder">您最近没有发表文章哦</div>
                <div v-else>
                  <div v-if="loadAll" class="none-placeholder">没有更多了</div>
                  <div @click="onLoadMoreArticle" v-else class="loading-more">加载更多</div>
                </div>
              </div>
              <div v-if="currentNav===1">
                <comment-item @change="onEditChange" v-for="(comment,index) in commentList" :item="comment"
                  :key="'comment'+comment.comment_id+index" class="mine-comment-item" :checked="selectAll">
                </comment-item>
                <div v-if="!commentList.length" class="none-placeholder">您最近没有评论哦</div>
                <div v-else>
                  <div v-if="loadAll" class="none-placeholder">没有更多了</div>
                  <div @click="onLoadMoreComment" v-else class="loading-more">加载更多</div>
                </div>
              </div>
              <div v-if="currentNav===2">
                <reply-item @change="onEditChange" v-for="(reply,index) in replyList" :item="reply"
                  :key="'reply'+reply.comment_id" class="mine-comment-item" :checked="selectAll">
                </reply-item>
                <div v-if="!replyList.length" class="none-placeholder">您没有回复消息哦</div>
                <div v-else>
                  <div v-if="loadAll" class="none-placeholder">没有更多了</div>
                  <div @click="onLoadMoreReply" v-else class="loading-more">加载更多</div>
                </div>
              </div>
            </ul>
          </form>
        </ul>
        <!-- 用户资料 -->
        <ul v-if="checkedMenu===1" class="menu-view-wrapper">
          <ul class="personal-setting-item">
            <li class="setting-input-label">头像</li>
            <span class="setting-input avatar-picker">
              <input title="" type="file" class="" placeholder="点击选择新头像" @change="onPickAvatar">
              <ximage v-if="(user&&user.avatar) ||  (pickAvatar &&pickAvatar.url)"
                :src="(user&&user.avatar) ||  (pickAvatar &&pickAvatar.url)" width="32" height="20" mode="aspectFill">
              </ximage>
              <span class="placeholder">{{pickAvatar?pickAvatar.name:'点击选择新头像'}}</span>
            </span>
            <span class="setting-confirm-btn">
              <span @click="modifyAvatar" class="ict icfasong icon-send"></span>
            </span>
          </ul>

          <ul class="personal-setting-item">
            <li class="setting-input-label">昵称</li>
            <input @input="(e)=>userName=e.target.value" type="text" class="setting-input"
              :placeholder="user&&user.nickname||'输入新的昵称'">
            <span class="setting-confirm-btn">
              <span @click="modifyName" class="ict icfasong icon-send"></span>
            </span>
          </ul>

          <ul class="personal-setting-item">
            <li class="setting-input-label">性别</li>
            <input @input="(e)=>userGender=e.target.value" type="text" class="setting-input"
              :placeholder="(user&&user.gender)||'男/女'">
            <span class="setting-confirm-btn">
              <span @click="modifyRender" class="ict icfasong icon-send"></span>
            </span>
          </ul>

          <ul class="personal-setting-item">
            <li class="setting-input-label">邮箱</li>
            <input @input="(e)=>userEmail=e.target.value" type="text" class="setting-input"
              :placeholder="(user&&user.email)||'输入联系邮箱'">
            <span class="setting-confirm-btn">
              <span @click="modifyEmail" class="ict icfasong icon-send"></span>
            </span>
          </ul>

          <ul class="personal-setting-item">
            <li class="setting-input-label">城市</li>
            <input @input="(e)=>userCity=e.target.value" type="text" class="setting-input"
              :placeholder="(user&&user.city)||'输入现居城市'">
            <span class="setting-confirm-btn">
              <span @click="modifyCity" class="ict icfasong icon-send"></span>
            </span>
          </ul>

          <ul class="personal-setting-item">
            <li class="setting-input-label">介绍</li>
            <textarea @input="(e)=>userIntro=e.target.value" class="setting-textarea" maxlength="80"
              :placeholder="(user&&user.introduce)||'输入自我介绍，最多不超过80字。'"></textarea>
            <span class="setting-confirm-btn">
              <span @click="modifyIntro" class="ict icfasong icon-send"></span>
            </span>
          </ul>

        </ul>
        <ul v-if="checkedMenu===2" class="menu-view-wrapper none-placeholder">
          建设中
        </ul>
        <ul v-if="checkedMenu===3" class="menu-view-wrapper none-placeholder">
          建设中
        </ul>
      </div>
    </div>
    <bottom-footer></bottom-footer>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { upload, getToken } from '@/utils/qiniu.js'
  import articleItem from './myArticleItem.vue'
  import commentItem from './myCommentItem.vue'
  import replyItem from './myReplyItem.vue'
  export default {
    name: 'setting',
    components: {
      articleItem,
      commentItem,
      replyItem
    },
    props: {},
    data()
    {
      return {
        checkedMenu: 0,
        pickAvatar: null,
        userName: '',
        userGender: '',
        userCity: '',
        userEmail: '',
        userIntro: '',
        currentNav: 0,
        articleList: [],
        commentList: [],
        replyList: [],
        page: 1,

        selectAll: false,
        // 批量处理列表，包括作品、评论、回复的id
        modifyList: [],
        loadAll: false
      }
    },
    computed: mapState(['showNav', 'user']),
    created()
    {
      this.init()
    },
    methods: {
      init()
      {
        let { menu, nav } = this.$route.params
        if (typeof menu === 'number') {
          this.checkedMenu = menu
        }
        if (typeof nav === 'number') {
          this.currentNav = nav
        }
        this.onCheckMenu(this.checkedMenu)
      },
      // 文章作品列表
      getArticleList()
      {
        this.$http.get('/article/getFromUser', {
          token: gStatus.getToken(),
          page: this.page,
        }).then(res =>
        {
          let { code, msg, data } = res.data
          if (code === 200) {
            this.articleList = this.page > 1 ? [...this.articleList, ...data] : data
            this.loadAll = data.length < 10
          }
        })
      },
      // 我的评论列表
      getCommentList()
      {
        this.$http.get('/comment/getListFromUser', {
          token: gStatus.getToken(),
          page: this.page,
        }).then(res =>
        {
          let { code, msg, data } = res.data
          if (code === 200) {
            this.commentList = this.page > 1 ? [...this.commentList, ...data] : data
            this.loadAll = data.length < 10
          }
        })
      },
      // 回复列表
      getReplyList()
      {
        this.$http.get('/comment/getListToUser', {
          token: gStatus.getToken(),
          page: this.page,
        }).then(res =>
        {
          let { code, msg, data } = res.data
          if (code === 200) {
            this.replyList = this.page > 1 ? [...this.replyList, ...data] : data
            this.loadAll = data.length < 10
          }
        })
      },
      onLoadMoreArticle()
      {
        this.page++
        this.getArticleList()
      },

      onLoadMoreComment()
      {
        this.page++
        this.getCommentList()
      },
      onLoadMoreReply()
      {
        this.page++
        this.getReplyList()
      },
      // 我的主页
      getUserList()
      {
        this.onCheckNav(this.currentNav)
      },
      onPickAvatar(e)
      {
        let o = e.target.files[0]
        let url = URL.createObjectURL(o)
        this.pickAvatar = { url, name: o.name, file: o }
      },

      onCheckMenu(menu)
      {
        this.checkedMenu = menu
        if (this.checkedMenu === 0) {
          this.getUserList()
        }
      },
      // 选择主页筛选按钮
      onCheckNav(c)
      {
        this.currentNav = c
        this.page = 1
        this.selectAll = false
        this.modifyList = []

        if (this.currentNav === 0) {
          this.getArticleList()
        } else if (this.currentNav === 1) {
          this.getCommentList()
        } else if (this.currentNav === 2) {
          this.getReplyList()
        }
      },

      // 修改资料头像
      modifyAvatar()
      {
        if (!this.pickAvatar) {
          return UI.showToast({
            content: '请先选择头像图片'
          })
        }
        getToken().then(token =>
        {
          // 获取七牛token
          let { file, name } = this.pickAvatar
          upload({
            file,
            name,
            token
          }).then(res =>
          {
            if (res.url) {
              // 上传七牛成功
              this.updateInfo('avatar', res.url, '头像更新成功')
            }
          })
        }).catch(err =>
        {
          console.log('上传头像失败：', err)
          UI.showToast({
            content: err.msg
          })
        })
      },

      updateInfo(key, value, successMsg = '修改成功')
      {
        if (!value) {
          return UI.showToast({
            content: '请输入内容'
          })
        }

        let data = {
          token: gStatus.getToken(),
        }
        data[key] = value
        this.$http.post("/user/update", data).then(res =>
        {
          let { code, msg } = res.data
          if (code === 200) {
            UI.showToast({
              content: successMsg,
              type: 'success'
            })

            gStatus.initUser(Object.assign(gStatus.userData, data), this)

          } else {
            UI.showToast({
              content: msg
            })
          }
        })
      },
      modifyName()
      {
        if (!this.userName) {
          return UI.showToast({
            content: '请输入昵称'
          })
        }
        this.updateInfo('nickname', this.userName, '昵称修改成功')
      },
      modifyRender()
      {
        if (!this.userGender) {
          return UI.showToast({
            content: '请输入性别'
          })
        }
        this.updateInfo('gender', this.userGender, '性别修改成功')
      },
      modifyCity()
      {
        if (!this.userCity) {
          return UI.showToast({
            content: '请输入居住城市'
          })
        }
        this.updateInfo('city', this.userCity, '城市修改成功')
      },
      modifyEmail()
      {
        if (!this.userEmail) {
          return UI.showToast({
            content: '请输入联系邮箱'
          })
        }
        this.updateInfo('email', this.userEmail, '邮箱修改成功')
      },
      modifyIntro()
      {
        if (!this.userIntro) {
          return UI.showToast({
            content: '请输入介绍内容'
          })
        }
        this.updateInfo('introduce', this.userIntro, '介绍修改成功')
      },

      deleteListItem(listName, key, value)
      {
        if (this[listName] && this[listName].length) {
          let index = this[listName].findIndex(item => item[key] === value)
          if (index >= 0) {
            this[listName].splice(index, 1)
          }
        }
      },
      // 主页编辑我的评论变化
      onEditChange(e)
      {
        let { checked, id } = e
        if (checked) {
          this.modifyList.push(id)
        } else {
          let idx = this.modifyList.findIndex(item => item === id)
          if (idx >= 0) {
            this.modifyList.splice(idx, 1)
          }
        }
        console.log('编辑评论：', this.modifyList)
      },

      // 修改项目
      onModify()
      {
        if (this.currentNav === 0) {
          if (this.selectAll) {
            return
          }
          if (this.modifyList.length) {
            let id = this.modifyList[0];
            console.log({ id })
            if (id) {
              let route = this.$router.resolve({
                path: '/publish',
                query: {
                  id
                }
              })
              window.open(route.href, '_blank')
            }
          } else {
            return UI.showToast({
              content: '没有要修改的对象'
            })
          }
        }
      },

      // 批量删除操作
      onSubmitModify(e)
      {
        if (typeof this.currentNav === 'number') {
          let path = (this.currentNav === 0 && '/article/delete') || (this.currentNav === 1 && '/comment/delete') || (this.currentNav === 2 && '')
          if (!path) {
            return UI.showToast({
              content: 'fail',
              type: 'fail'
            })
          }
          if (this.selectAll) {
            let arr = [];
            if (this.currentNav === 0) {
              this.modifyList = this.articleList.map(at => at.article_id)
            } else if (this.currentNav === 1) {
              this.modifyList = this.commentList.map(at => at.comment_id)
            } else if (this.currentNav === 2) {
              this.modifyList = this.replyList.map(at => at.comment_id)
            }
          }
          if (!this.modifyList.length) {
            return UI.showToast({
              content: '没有需要操作的项目'
            })
          }
          let postData = {
            token: gStatus.getToken(),
          }
          let list = {
            name: (this.currentNav === 0 && 'articleList') || (this.currentNav === 1 && 'commentList') || (this.currentNav === 2 && 'replyList'),
            key: (this.currentNav === 0 && 'article_id') || (this.currentNav === 1 && 'comment_id') || (this.currentNav === 2 && 'comment_id')
          }
          let len = this.modifyList.length;
          // 按记录一条一条操作
          for (let i = 0; i < len; i++) {
            ((index) =>
            {
              let id = this.modifyList[index]
              if (this.currentNav === 0) {
                postData.article_id = id
              } else if (this.currentNav === 1) {
                postData.comment_id = id
              } else if (this.currentNav === 2) {
                postData.comment_id = id
              }
              this.$http.post(path, postData).then(res =>
              {
                let { code, msg } = res.data
                if (code === 200) {
                  this.deleteListItem(list.name, list.key, id)
                  UI.showToast({
                    content: '操作成功',
                    type: 'success'
                  })
                } else {
                  UI.showToast({
                    content: '操作失败，请稍后再试'
                  })
                }
              })
            })(i)
          }
        }
      }
    }
  }
</script>

<style lang='scss'>
  @media screen and(max-width: 674px) {
    .setting-body {
      padding: 10px;
      background-color: white !important;
      flex-direction: column;

      .setting-left-menu,
      .menu-list {
        display: flex;
        align-items: center;
        width: 100% !important;
      }

      .menu-list {
        justify-content: space-around;

        .menu-item {
          flex-grow: 1;
          border-top: 1px solid #e8e8e8;

          &:first-child {
            border-left: 1px solid #e8e8e8;
          }
        }
      }

      .setting-view-wrapper {
        padding: 10px 0 !important;
        margin-left: 0 !important;
      }

      .user-area {
        flex-direction: row !important;
        padding: 0 !important;
        margin-right: 20px;

        .user-nickname {
          font-size: 14px !important;
          margin: 10px 0 0 0 !important;
        }
      }
    }

    .menu-item-checked {
      border-right: 1px solid #f2f2f2 !important;
      border-bottom: none !important;
    }
  }

  @media screen and (min-width: 675px) {
    .setting-view-wrapper {
      padding: 20px 40px 25px 40px !important;
    }
  }


  .setting-body {
    display: flex;
    margin: 10px auto;
    font-size: 14px;
    min-height: 600px;
    background-color: transparent;

    .setting-left-menu {
      width: 1.2rem;
      background-color: #fff;

      .menu-list {

        .menu-item {
          cursor: pointer;
          text-align: center;
          font-weight: 600;
          padding: 20px 10px;
          border-bottom: 1px solid #e8e8e8;
        }

        .menu-item-checked {
          border-right: 1px solid transparent;
          background: #f8f8f8;
        }

        .menu-item-hover {
          color: #2f54eb;
        }
      }

      .user-area {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 10px;

        .user-nickname {
          font-size: 18px;
          font-weight: 600;
          margin: 20px 0;
          white-space: nowrap;
          max-width: 100px;
          /* color: #5a6d96; */
        }

        .user-avatar {}

        .user-avatar-place {
          font-size: 36px;
        }
      }
    }

    .setting-view-wrapper {
      /* flex: 3 1 auto; */
      padding: 25px;
      width: 100%;
      margin-left: 10px;
      background-color: #fff;

      .menu-view-wrapper {
        display: flex;
        flex-direction: column;

        .personal-setting-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          width: 100%;

          .setting-input-label {
            white-space: nowrap;
            margin-right: 20px;
          }

          .avatar-picker {
            position: relative;
            display: flex !important;
            align-items: center;

            input {
              position: absolute;
              z-index: 100;
              left: 0;
              top: 0;
              right: 0;
              bottom: 0;
              opacity: 0;
            }

            .placeholder {
              margin-left: 10px;
            }
          }

          .setting-input,
          .setting-textarea {
            display: block;
            width: 100%;
            padding: 10px;
            /* min-width: 200px; */
            border: 1px solid #dcdcdc;
          }

          .setting-confirm-btn {
            flex-shrink: 0;
            width: 1rem;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            .icon-send {
              color: #787878;
              font-size: 20px;
              cursor: pointer;
            }
          }

          .setting-textarea {
            height: 200px;
          }
        }

        .menu-personal-right {
          flex: 2 0 auto;
        }

        .personal-nav {
          display: flex;
          align-items: center;
          width: 100%;
          border-bottom: 1px solid #dcdcdc;

          .personal-nav-item {
            flex-grow: 1;
            padding: 10px 0;
            text-align: center;
          }

          .personal-nav-item-checked {
            font-weight: 600;
            color: #2f54eb;
          }
        }

        .item-operation-nav {
          display: flex;
          padding-left: 10px;
          font-size: 10px;

          .select-all-checkbox {
            width: 22px;
            height: 22px;
            margin-right: 4px;
            -webkit-appearance: checkbox;
          }

          .item-operation-box {
            display: flex;
            align-items: center;
            margin-left: 20px;
            padding-left: 10px;
            width: 100%;
            height: 32px;

            .operation-btn {
              display: flex;
              align-items: center;
              justify-content: center;
              flex-grow: 1;
              color: #787878;
              border-right: 1px solid #dfdfdf;
              border-bottom: 1px solid #dfdfdf;
              padding: 6px 0;
              height: 100%;

              .icon {
                font-size: 14px;
                margin-right: 8px;
              }

              &:first-child {
                border-left: 1px solid #dfdfdf;
              }
            }
          }
        }

        .personal-item-list {
          padding: 10px 0;

          .mine-article-item,
          .mine-comment-item {
            border-bottom: 1px solid #f2f2f2;
          }
        }
      }
    }
  }
</style>