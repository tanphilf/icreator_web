<template>
  <main :class="['main-body container']">
    <!-- 顶部banner及热门列表 -->
    <div class="content-top-container">
      <div class="main-top-list">
        <ad :ad="advertisements[1]" class="top-ad"></ad>
      </div>
      <banner class="main-banner" :items="banners"></banner>
    </div>
    <div class="content-container">
      <!-- 侧栏 -->
      <aside class="content-aside">
        <div :class="['aside-content-container content-box',fixAside?'content-aside-fix':'']">
          <ul class="aside-recommend-title">
            <li class="ict ichot3"></li>
            <li class="title">热门推荐</li>
          </ul>
          <ul class="content-recommend-aside">
            <hot-item v-for="(item, index) in hotList" :item="item" :key="item&&item.article_id"></hot-item>
          </ul>
          <ad :ad="advertisements[0]" style="margin: 10px auto;"></ad>
          <bottom-footer></bottom-footer>
        </div>
        <div v-if="showTop" @click="goTop" class="ict icTop top-btn"></div>
      </aside>

      <!-- 正文列表 -->
      <div :class="['content-list content-box']">
        <list-item v-for="(item, index) in articleList" :key="item+index" :index="index" :transitionType="transType"
          parent="root" class="art-item">
          <articleItem :item="item"></articleItem>
        </list-item>
        <p class="none-placeholder">{{loadAll?'没有更多了':'加载中...'}}</p>
        <div v-if="showTop" @click="goTop" class="ict icTop top-btn"></div>
      </div>
    </div>
  </main>
</template>

<script>
  import banner from './components/banner'
  import articleItem from './components/articleItem'
  import hotItem from './components/hotItem'
  import ad from './components/ad'
  export default {
    name: '',
    components: {
      banner,
      articleItem,
      hotItem,
      ad
    },
    props: {
      loadMore: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      loadMore(ld)
      {
        if (ld) {
          this.loadMoreData()
        }
      }
    },
    data()
    {
      return {
        fixAside: false,
        transType: 'default',
        page: 1,
        pageSize: 50,
        showTop: false,
        loadAll: false,
        articleList: [],
        hotList: [],
        banners: [],
        advertisements: [
          {
            cover: 'https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84f2f5347c464ffe96aab061ebe2cebb~tplv-k3u1fbpfcp-zoom-1.image'
          },
          {
            cover: 'https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c79ed6f4fc141ab84896f81ecd5d8ff~tplv-k3u1fbpfcp-zoom-1.image'
          }
        ]
      }
    },

    created()
    {
      this.$root.$on('scroll', this.onPageScroll)
    },
    destroyed()
    {
      this.$root.$off('scroll', this.onPageScroll)
    },

    mounted()
    {
      // 触底滚动不依赖list组件的话需要在根结点初始化一些必须信息
      let {
        offsetWidth,
        offsetHeight,
        scrollLeft,
        scrollTop,
        offsetTop,
        offsetLeft,
      } = this.$root.$el
      Object.assign(this.$root, {
        offsetWidth,
        offsetHeight,
        scrollLeft,
        scrollTop,
        offsetTop,
        offsetLeft,
        page: 1,
        pageSize: this.pageSize,
        horizontal: false,
        loadMoreDistance: 80,
      })

      this.getList()
      this.getHot()
    },

    methods: {
      // 返回顶部
      goTop()
      {
        // window.scrollTo({
        //   top: 0,
        //   behavior: 'smooth'
        // })
        // 兼容移动端平滑滚动
        let smoothscroll = () =>
        {
          let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
          if (scrollTop > 0) {
            window.requestAnimationFrame(smoothscroll)
            window.scrollTo(0, scrollTop - scrollTop / 2)
          }
        }
        smoothscroll()
      },

      onPageScroll(e)
      {
        let page = this.$root.page
        let { offsetHeight, clientHeight, scrollTop } = e
        this.$root.scrollTop = scrollTop
        this.fixAside = e.scrollTop >= 300
        if ((scrollTop + clientHeight) % offsetHeight === 0) {
          this.$root.page++
          this.loadMoreData()
        }
        this.showTop = e.scrollTop >= 800
      },

      loadMoreData()
      {
        this.page++
        this.getList(true)
      },

      getHot()
      {
        this.$http.get('/article/getHot', {
          page: 1,
          pageSize: 10
        }).then(res =>
        {
          let { code, data } = res.data
          if (code == 200) {
            if (data && data.length) {
              this.hotList = data.slice(0, 5)
              this.banners = data.filter(at => at.cover)
            }
            console.log('获取热门列表:', this.banners)
          }
        })
      },

      getList(loadMore = false)
      {
        this.$http.get('/article/getlist', {
          page: this.page,
          pageSize: this.pageSize
        }).then(res =>
        {
          let { code, data } = res.data
          if (code == 200) {
            if (data instanceof Array) {
              if (!this.loadAll) {
                this.articleList = this.page > 1 ? [...this.articleList, ...data] : data
              }
              if (data.length < this.pageSize) {
                this.loadAll = true
                // 锁定页码
                if (loadMore) {
                  this.page--
                }
              }
            }
            console.log('获取文章列表:', this.articleList)
          }
        })
      },
    }
  }
</script>

<style lang='scss'>
  .main-body {
    .content-top-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 300px;
      margin-bottom: 10px;

      .main-banner {
        flex-grow: 4;
        min-width: 4.14rem;
        height: 100%;
        max-width: 840px;
      }
    }


    @media screen and(max-width: 674px) {
      .main-top-list {
        display: none;
      }

      .content-list {
        padding: 20px 10px !important;
      }

      .content-aside {
        display: none;
      }
    }

    @media screen and(min-width: 675px) {
      .main-top-list {
        width: 240px;
        height: 100%;
        margin-right: 10px;
        background-color: white;

        .top-ad {}
      }

      .content-aside {
        flex-shrink: 0;
        width: 2.4rem;
        margin-bottom: auto;

        .top-btn {
          position: fixed;
          z-index: 100;
          bottom: 30px;
          margin-left: 200px;
          font-size: 36px;
          color: #acacac;
        }
      }

      .content-list {
        margin-left: 10px;
        padding: 30px 24px !important;

        .top-btn {
          display: none;
        }
      }
    }

    .content-container {
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .content-list {
        width: 100%;
        min-height: 320px;
        padding: 50px 10px;

        .none-placeholder {
          margin-top: 50px;
        }

        .top-btn {
          position: fixed;
          z-index: 100;
          bottom: 50px;
          right: 10px;
          font-size: 36px;
          color: #acacac;
          margin-left: auto;
        }

        .art-item {
          border-bottom: 1px solid #f2f2f2;
          margin: 10px 0;

          &:last-child {
            border-bottom: none;
          }

        }
      }

      .content-aside-fix {
        position: fixed;
        top: .56rem;
      }

      .aside-content-container {
        width: 2.4rem;
        background-color: white;

        .aside-recommend-title {
          display: flex;
          align-items: center;
          color: red;
          padding: 20px 10px;

          .title {
            font-size: 18px;
            font-weight: bold;
            margin-left: 10px;
          }
        }
      }
    }
  }
</style>