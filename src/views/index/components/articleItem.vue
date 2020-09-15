<template>
  <router-link class="article-item-wrapper" :to="'/detail/'+item.article_id" target="_blank">
    <div :class="['article-item-info', !item.cover? 'article-type-1' :'']">
      <div>
        <h4 class="article-title text-overflow-2">{{formatItem.title}}</h4>
        <p class="article-description text-overflow-2">{{formatItem.desc}}</p>
      </div>

      <div class="article-btm-info">
        <div class="article-btm-left">
          <span class="author-name">
            <b>{{formatItem.user&&formatItem.user.nickname}}</b>
            <p style="font-size: 8px;margin: 2px 0 0 6px;">•</p>
          </span>
          <ul v-if="item.date" class="article-info-item">
            <li class="ict ictime article-info-icon"></li>
            <li>{{formatItem.date}}</li>
          </ul>
        </div>
        <div class="article-btm-right">
          <ul class="article-info-item">
            <li class="ict icview1 article-info-icon"></li>
            <li>{{formatItem.view_num}}</li>
          </ul>
        </div>
      </div>

    </div>
    <ximage v-if="item.cover" class="article-cover" :src="item.cover" :loaded="!!item.title" mode="aspectFill"
      width="80" height="80">
    </ximage>
  </router-link>
</template>

<script>
  export default {
    name: 'articleItem',
    props: {
      item: {
        type: Object,
        default: function ()
        {
          return {}
        }
      }
    },
    watch: {
      item: {
        immediate: true,
        handler(item)
        {
          let time = item.create_at * 1000, date = '刚刚';
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
          item.date = date;
          this.formatItem = item;
        }
      }
    },
    data()
    {
      return {
        formatItem: {}
      }
    },
    methods: {
    }
  }
</script>

<style lang='scss'>
  .article-item-wrapper {
    position: relative;
    display: flex;
    flex-direction: row;
    padding: 20px 0;
    border-bottom: 1px solid #f2f2f2;

    &:last-child {
      border-bottom: none;
    }

    .article-cover {
      flex-shrink: 0;
      /* border-radius: 4px; */
    }

    .article-type-1 {
      padding-left: 0 !important;
      margin-left: 0 !important;
    }

    .article-item-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1 1 auto;
      padding: 0 10px;
      margin-right: 20px;

      .article-description {
        width: 100%;
      }

      .article-title {
        /* padding-right: 80px; */
        max-width: 640px;
        font-size: 16px;
      }
    }

    .article-btm-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #787878;

      .article-btm-left {
        display: flex;
        align-items: center;

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

        .article-info-icon {
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