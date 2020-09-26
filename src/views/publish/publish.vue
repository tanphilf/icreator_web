<template>
  <div class="page-wrapper">
    <head-nav :show="showNav"></head-nav>
    <form>
      <div :class="['publish-page-wrapper container content-box', showNav?'nav-body-fix':'']">
        <!-- <h3>发布内容</h3> -->
        <div class="publish-operation-box">
          <div class="publish-operation-item">
            <span class="operation-label">标题<em class="required">*</em></span>
            <input @input="onInputTitle" class="publish-input" type="text" value="" maxlength="50"
              placeholder="输入文章标题，最长50个字符" :value="title">
          </div>
          <div class="publish-operation-item">
            <span class="operation-label">封面</span>
            <span class="publish-input file-picker-container">
              <ximage v-if="cover.url" class="cover-img" :src="cover.url" width="24" height="24" mode="aspectFill">
              </ximage>
              <li class="input-place-holder">{{cover.name||cover.url||'点击选择新头像'}}</li>
              <input class="file-picker-input" type="file" placeholder="点击选择新头像" @change="onCheckFile">
            </span>
          </div>
          <div class="publish-operation-item">
            <span class="operation-label">标签</span>
            <input class="publish-input" type="text" :value="tags" maxlength="32" placeholder="输入自定义标签，用逗号分隔">
          </div>
          <div class="publish-operation-item">
            <span class="operation-label">内容<em class="required">*</em></span>
            <quill-editor :class="['editor', showNav?'ql-toolbar-fix':'']" ref="contentEditor" v-model="content"
              :options="editorOption" @blur="onEditorBlur" @focus="onEditorFocus" @ready="onEditorReady"
              @change="onEditorChange">
            </quill-editor>
            <input type="file" class="eidtor-file-picker" @change="onEditorPickerChange"></input>
          </div>
        </div>
        <div class="operation-btn-box">
          <div class="publish-btn-wrapper">
            <button @click="onSave" class="publish-btn cancel-btn" type="reset">保存</button>
            <button @click="onReset" class="publish-btn cancel-btn" type="reset">清空</button>
            <span @click="onConfirm" class="confirm-btn publish-btn">{{articleId?'修改':'发布'}}</span>
          </div>
        </div>
      </div>
    </form>
    <bottom-footer></bottom-footer>
  </div>
</template>

<script>
  import { quillEditor, Quill } from 'vue-quill-editor'
  import { mapState } from 'vuex'
  import { upload, getToken } from '@/utils/qiniu'

  let qiniuToken;
  export default {
    name: 'publish',
    components: {
      quillEditor
    },
    props: {},
    data()
    {
      return {
        editorOption: {
          modules: {
            toolbar: {
              //工具菜单栏配置
              container: [
                [{ size: ["small", false, "large", "huge"] }], // 字体大小
                [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
                [{ font: [] }], // 字体种类
                ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
                ["blockquote", "code-block"], // 引用  代码块
                // [{ header: 1 }, { header: 2 }], // 1、2 级标题
                [{ script: "sub" }, { script: "super" }], // 上标/下标
                [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
                [{ indent: "-1" }, { indent: "+1" }], // 缩进
                ["clean"], // 清除文本格式
                [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
                [{ align: [] }], // 对齐方式
                ["link", "image", "video"] // 链接、图片、视频
              ],
              // container: container,
              handlers: {
                'image': function (v)
                {
                  if (v) {
                    let dom = document.querySelector('.eidtor-file-picker')
                    dom.click()
                  } else {
                    this.quill.format('image', false);
                  }
                }
              }
            },
          },
          placeholder: '输入文章内容', //提示
          readyOnly: false, //是否只读
          theme: 'snow', //主题 snow/bubble
          syntax: true, //语法检测
        },
        articleId: '',
        title: '',
        cover: {
          name: '点击选择封面图片，不超过3M',
          file: null,
          url: ''
        },
        content: '',
        tags: '',
        description: ''
      }
    },
    computed: mapState(['showNav']),
    beforeRouteEnter(to, from, next)
    {
      if (!gStatus.getToken()) {
        document.location.href = '/login'
      } else {
        next(true)
      }
    },
    created()
    {
      getToken().then(token => qiniuToken = token)
      this.init()
    },
    methods: {
      init()
      {
        let { id } = this.$route.query
        this.initArticle(id)
      },
      initArticle(id)
      {
        if (id) {
          this.$http.get("/article/getFromId", {
            id
          }).then(res =>
          {
            let { code, msg, data } = res.data
            if (code === 200) {
              this.articleId = id;
              this.title = data['title']
              this.content = data.content
              this.cover = {
                name: data['cover'],
                file: null,
                url: data['cover']
              }
              this.tags = data['tags']
            }
          })
        }
      },
      onEditorBlur(e) { },
      onEditorFocus(e) { },
      onEditorReady(e) { },
      onEditorChange(e) { },
      // 更改编辑器base64图片为url
      onEditorPickerChange(e)
      {
        if (!qiniuToken) {
          return UI.showToast({
            content: '请先登录再操作'
          })
        }
        let files = e.target.files
        if (files.length) {
          let file = files[0]
          let quill = this.$refs.contentEditor.quill
          let pos = quill.getSelection().index
          upload({
            name: file.name,
            file: file,
            token: qiniuToken,
          }).then(res =>
          {
            try {
              console.log('图片上传成功: ', pos, res.url)
              quill.insertEmbed(pos, 'image', res.url)
              quill.setSelection(pos + file.name.length)
            } catch (e) {
              console.log(e)
            }

          }).catch(err =>
          {
            console.log('图片上传失败：', err)
          })
        }
      },
      onReset()
      {
        this.title = ''
        this.content = ''
        this.cover = null
        this.tags = ''
      },
      onSave()
      {
      },
      onInputTitle(e)
      {
        this.title = e.target.value;
      },
      onInputContent(e)
      {
        this.content = e.target.value;
      },
      onCheckFile(e)
      {
        let files = e.target.files
        if (files.length) {
          let file = files[0];
          let d = {
            file,
            name: file.name
          };
          upload({
            name: d.name,
            file: d.file,
            token: qiniuToken,
          }).then(e =>
          {
            console.log('封面上传成功', e)
            d.url = e.url
            this.cover = d
          }).catch(err =>
          {
            console.log('封面上传失败', err)
            this.cover = d
          })
        }
      },
      onConfirm()
      {
        if (!this.title) {
          return UI.showToast({
            content: '请输入标题'
          })
        }
        if (!this.content) {
          return UI.showToast({
            content: '请输入内容'
          })
        }

        if (this.articleId) {
          // 修改
          this.$http.post('/article/update', {
            token: gStatus.getToken(),
            article_id: this.articleId,
            title: this.title,
            content: this.content,
            cover: this.cover.url || '',
            tags: this.tags,
            description: this.description
          }).then(res =>
          {
            console.log('修改文章返回：', res)
            let { code, msg } = res.data
            if (code == 200) {
              UI.showToast({
                content: '修改成功'
              })
            } else {
              UI.showToast({
                content: msg
              })
            }
          })
        } else {
          // 新发布
          this.$http.post('/article/add', {
            token: gStatus.getToken(),
            title: this.title,
            content: this.content,
            cover: this.cover.url || ''
          }).then(res =>
          {
            console.log('发送文章返回：', res)
            let { code, msg } = res.data
            if (code == 200) {
              this.$router.push('/index')
            } else {
              UI.showToast({
                content: msg
              })
            }
          })
        }
      }
    }
  }
</script>

<style lang='scss'>
  .required {
    color: red;
  }

  .cover-img {
    margin-right: 10px;
  }

  .input-place-holder {
    font-size: 12px;
    color: #b5b5b5;
  }

  .file-picker-container {
    display: flex;
    align-items: center;
    position: relative;
    min-height: 32px;

    input {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 100;
      opacity: 0;
    }

    .input-place-holder {
      word-break: break-all;
    }
  }

  .publish-page-wrapper {
    min-height: 400px;
    padding-bottom: 40px;

    @media screen and (max-width: 416px) {
      .publish-operation-box {
        padding: .3rem;

        .publish-operation-item {
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;

          .operation-label {
            margin-bottom: 10px;
          }

          .publish-input {
            width: 100%;
          }
        }
      }

      .operation-btn-box {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-right: 0 !important;
        padding-bottom: 40px;

        .publish-btn-wrapper {
          margin-left: 0 !important;
        }
      }
    }

    @media screen and(max-width: 416px) {
      .ql-toolbar-fix {
        .ql-toolbar {
          position: fixed;
          top: 50px;
          left: 0;
          z-index: 100;
          max-width: 100%;
          background-color: white;
        }
      }
    }

    @media screen and (min-width: 417px) {
      .publish-operation-box {
        padding: .3rem 1rem .3rem .3rem;
      }

      .ql-toolbar-fix {
        .ql-toolbar {
          position: fixed;
          top: 50px;
          z-index: 100;
          max-width: 750px;
          background-color: white;
        }
      }

    }

    .publish-operation-item {
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      .operation-label {
        width: 40px;
        margin-right: 20px;
        white-space: nowrap;
      }

      .publish-input {
        flex: 3 1 auto;
        padding: 4px 10px;
        border: 1px solid #ccc;
      }

      .publish-textarea {
        min-height: 300px;
      }
    }

    .operation-btn-box {
      width: 100%;
      padding-right: 1rem;

      .publish-btn-wrapper {
        margin-left: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 220px;

        .publish-btn {
          width: 100px;
          font-size: 14px;
          margin-right: 10px;

          &:last-child {
            margin-right: 0;
            border-color: transparent;
          }
        }
      }

    }
  }

  .eidtor-file-picker {
    position: absolute;
    z-index: -999;
    opacity: 0;
    visibility: hidden;
  }


  .editor {
    line-height: normal !important;

    .ql-formats {
      margin-right: 0 !important;
    }
  }


  .editor .ql-editor {
    min-height: 320px !important;
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
  }

  /* 编辑器汉化 */
  .ql-snow .ql-tooltip[data-mode=link]::before {
    content: "请输入链接地址:";
  }

  .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: '保存';
    padding-right: 0px;
  }

  .ql-snow .ql-tooltip[data-mode=video]::before {
    content: "请输入视频地址:";
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: '14px';
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
    content: '10px';
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
    content: '18px';
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
    content: '32px';
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: '文本';
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: '标题1';
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: '标题2';
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: '标题3';
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: '标题4';
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: '标题5';
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: '标题6';
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: '标准字体';
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
    content: '衬线字体';
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
    content: '等宽字体';
  }
</style>