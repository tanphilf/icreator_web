<template>
  <div class="search-page-wrapper">
    <head-nav @searchConfirm="onConfirmSearch" :show="showNav"></head-nav>
    <div :class="['search-body container',showNav?'nav-body-fix':'']">
      <div class="search-head">
        <ul class="search-sort-nav">
          <sort-tab class="search-sort-item" label="综合" :checked="currentNav === 0"
            @change="(desc)=>onSortTypeChange(0,desc)">
          </sort-tab>
          <sort-tab class="search-sort-item" label="热度" :checked="currentNav === 1"
            @change="(desc)=>onSortTypeChange(1,desc)">
          </sort-tab>
          <sort-tab class="search-sort-item" label="时间" :checked="currentNav === 2"
            @change="(desc)=>onSortTypeChange(2,desc)">
          </sort-tab>
          <sort-tab class="search-sort-item" label="浏览量" :checked="currentNav === 3"
            @change="(desc)=>onSortTypeChange(3,desc)">
          </sort-tab>
        </ul>
      </div>
      <div class="search-result-list content-box">
        <div v-for="(item, i) in list" :key="item.id" class="search-item">
          <article-item :item="item"></article-item>
        </div>
        <div v-if="!list.length" class="none-place">
          <span>没有找到匹配的内容哦</span></span>
        </div>
        <div v-else>
          <div v-if="loadAll" class="none-placeholder">没有更多了</div>
          <div @click="onLoadMore" v-else class="loading-more">加载更多</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import articleItem from '../index/components/articleItem.vue'
  import sortTab from './sortTab.vue'
  export default {
    name: 'searchPage',
    components: {
      articleItem,
      sortTab
    },
    props: {},
    data()
    {
      return {
        currentNav: 0,
        list: [],
        page: 1,
        pageSize: 10,
        keyword: '',
        orderBy: 'all',
        desc: true,
        loadAll: false
      }
    },

    computed: mapState(['showNav']),

    created()
    {
      let keyword = this.$route.query.keyword || this.$route.params.keyword;
      if (keyword) {
        this.keyword = keyword
      }
      this.getList()
    },

    methods: {
      onConfirmSearch(e)
      {
        this.keyword = e.keyword
        this.getList()
      },
      onSortTypeChange(nav, desc = true)
      {
        this.currentNav = nav
        this.desc = desc
        this.orderBy = ['all', 'hot', 'time', 'view'][nav]
        this.getList()
      },

      onLoadMore()
      {
        this.page++
        this.getList()
      },

      getList()
      {
        this.$http.get('/article/search', {
          keyword: this.keyword,
          page: this.page,
          pageSize: this.pageSize,
          order_by: this.orderBy,
          desc: this.desc
        }).then(res =>
        {
          let { code, data, msg } = res.data
          if (code === 200) {
            if (data && data.length) {
              data.forEach(d =>
              {
                d.date = doget.time(d.create_at).format()
              });
            }
            this.list = this.page > 1 ? [...this.list, ...data] : data
            this.loadAll = data.length < 10
          }
        })
      },
    }
  }
</script>

<style lang='scss'>
  .search-page-wrapper {
    .search-head {
      color: #333;
      background-color: white;
      margin-top: 10px;
      padding: 30px 10px 10px 10px;

      .search-sort-nav {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #f2f2f2;
        padding: 10px;

        .search-sort-item {
          font-size: 14px;
          margin-right: 20px;
        }
      }
    }

    .search-body {
      padding-bottom: 80px;
    }

    .search-result-list {
      padding: 0 24px 34px 24px;
      min-height: 540px;
      box-shadow: none;

      .search-item {
        margin-bottom: 20px;
        border-bottom: 1px solid #e8e8e8;
      }
    }
  }
</style>