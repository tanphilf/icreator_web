<template>
  <router-link class="hot-article-item-wrapper" :to="'/detail/'+item.article_id" target="_blank">
    <div class="article-item-info">
      <div>
        <h4 class="article-title text-overflow-2">{{item.title}}</h4>
        <p class="article-description text-overflow-2">{{item.desc}}</p>
      </div>

      <div class="article-btm-info">
        <div class="article-btm-left">
          <!-- <span class="author-name">
            <b>{{item.user&&item.user.nickname}}</b>
          </span> -->
          <ul v-if="item.date" class="article-info-item">
            <li class="ict ichot3 article-hot-icon"></li>
            <li>{{hot}}</li>
          </ul>
        </div>
      </div>

    </div>
  </router-link>
</template>

<script>
  export default {
    name: 'hotItem',
    props: {
      item: {
        type: Object,
        default: function ()
        {
          return {}
        }
      }
    },
    data()
    {
      return {
        formatItem: {}
      }
    },
    computed: {
      hot()
      {
        return parseInt(this.item.like_num + this.item.view_num);
      }
    },
    methods: {
    }
  }
</script>

<style lang='scss'>
  .hot-article-item-wrapper {
    position: relative;
    display: flex;
    flex-direction: row;
    padding-bottom: 12px;
    margin-bottom: 14px;
    border-bottom: 1px solid #f2f2f2;

    &:last-child {
      border-bottom: none;
    }

    .article-item-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1 1 auto;
      padding: 0 10px;

      .article-description {
        width: 100%;
        font-size: 12px;
        color: #989898;
      }

      .article-title {
        font-weight: normal;
      }
    }

    .article-btm-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #787878;

      .article-btm-left {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .author-name {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: #5a6d96;
          margin-bottom: 2px;
        }

        .article-info-item {
          font-size: 10px;
          margin-left: 10px;
        }
      }

      .article-info-item {
        display: flex;
        align-items: center;
        margin-right: 10px;

        .article-hot-icon {
          color: red;
          margin-right: 2px;
          font-size: 12px;
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
</style>