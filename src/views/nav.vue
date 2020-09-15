<template>
  <div :class="['top-nav', show?'nav-show nav-fixed':'']">
    <div class="top-nav-container container">
      <!-- <a class="ict iclogo logo" href="/"></a> -->
      <div class="logo" :style="{backgroundImage: 'url('+logo+')'}"></div>
      <nav class="main-nav">
        <ul class="main-nav-list">
          <li class="nav-list-container">
            <ul class="nav-list flex-row-center">
              <router-link to="/index">
                <span class="nav-list-item nav-item">首页</span>
              </router-link>

              <router-link to="/publish">
                <span class="nav-list-item nav-item">创作</span>
              </router-link>

              <li @click="buldingTip" class="nav-list-item nav-item">
                <a>交流</a>
              </li>
              <li @click="buldingTip" class="nav-list-item nav-item">
                <a>活动</a>
              </li>
            </ul>
            <ul class="nav-mini-device-wrapper">
              <li @click.stop="()=>showNavList=!showNavList" class="nav-place nav-item">
                <span>{{navPlace}}</span>
                <span
                  :class="['ict icexpandmore place-expand-icon', showNavList?'place-list-icon-collapse':'place-list-icon-expand']"></span>
              </li>
              <li :class="['nav-expand-list', showNavList?'nav-expand-list-show':'nav-expand-list-hide']">
                <div>
                  <router-link to="/index">首页</router-link>
                </div>
                <div>
                  <router-link to="/publish">发布</router-link>
                </div>
                <div @click="buldingTip">交流</div>
                <div @click="buldingTip">活动</div>
              </li>
            </ul>
          </li>
          <li class="nav-search nav-item">
            <div class="nav-search-box">
              <input @input="onInputSearch" @keyup.enter="onConfirmSearch" maxlength="50" placeholder="搜索关键字/内容" />
              <div @click="onConfirmSearch" class="ict icsousuo2 search-icon"></div>
            </div>
          </li>
          <li class="nav-avatar flex-row-center">
            <div class="user-setting-cover flex-row-center">
              <div v-if="user.nickname" @click.stop="()=>showSetting=!showSetting">
                <div v-if="user&&user.avatar" class="user-avatar">
                  <ximage class="avatar" :src="user.avatar" width="32" height="32" mode="aspectFill">
                  </ximage>
                </div>

                <div v-else class="ict ictouxiang avatar-placeholder"></div>
              </div>
              <router-link v-else to="/login">
                <div class="text-overflow-1 not-login-btn">登陆</div>
              </router-link>
            </div>

            <ul :class="['user-setting-pane',showSetting?'user-setting-pane-show':'user-setting-pane-hide']">
              <li class="user-setting-item user-name text-overflow-1" :title="user&&user.nickname">
                <router-link :to="{name: 'setting',params: {menu: 0,nav: 0}}">{{user&&user.nickname}}</router-link>
              </li>
              <li class="user-setting-item">
                <router-link :to="{name: 'setting',params: {menu: 1}}">资料</router-link>
              </li>
              <li class="user-setting-item">
                <router-link :to="{name: 'setting'}">作品</router-link>
              </li>
              <li @click="onLogout" class="user-setting-item">退出</li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: '',
    props: {
      show: {
        type: Boolean,
        default: false
      },
      fix: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      show: {
        immediate: true,
        handler(s) { }
      },
      fix: {
        immediate: true,
        handler(f) { }
      }
    },

    computed: mapState(['user']),

    data()
    {
      return {
        logo: require('@/assets/weblogo.png'),
        showNavList: false,
        showSetting: false,
        navPlace: '首页',
        searchKeywords: '',
      }
    },

    created()
    {
      this.init()
      window.addEventListener('visibilitychange', this.updateLoginState)
      document.addEventListener('click', () =>
      {
        this.showNavList = false;
        this.showSetting = false;
      })
    },

    destroyed()
    {
      window.removeEventListener('visibilitychange', this.updateLoginState)
    },

    methods: {
      init()
      {
        gStatus.shoudUpdateUserInfo(this)
      },

      updateLoginState()
      {

      },

      buldingTip()
      {
        UI.showToast({
          content: '建设中~'
        })
      },

      onLogout()
      {
        gStatus.logout()
        this.showSetting = false
      },

      onInputSearch(e)
      {
        this.searchKeywords = e.target.value
      },
      onConfirmSearch()
      {
        // if (!this.searchKeywords) {
        //   return UI.showToast({
        //     content: '请输入搜索关键字'
        //   })
        // }

        this.$router.push({
          name: 'search', params: {
            keyword: this.searchKeywords
          }
        })
        this.$emit('searchConfirm', {
          keyword: this.searchKeywords
        })
      },
    }
  }
</script>

<style lang='scss'>
  .top-nav {
    position: relative;
    width: 100%;
    background-color: #2f54eb;
  }

  @keyframes navShow {
    0% {
      transform: translateY(-100%);
    }

    100% {
      transform: translateY(0);
    }
  }


  @keyframes navHide {
    0% {
      transform: translateY(0);
    }

    100% {
      transform: translateY(-100%);
    }
  }

  .nav-fixed {
    position: fixed;
    z-index: 300;
    top: 0;
  }

  .nav-normal {
    position: relative;
  }

  .nav-show {
    animation: navShow .36s ease-in-out;
  }

  .nav-hide {
    transform: translateY(-100%);
    transition: navHide;
  }

  @media screen and(max-width: 320px) {
    .top-nav-container {
      padding-right: 0 !important;
    }

    .logo {
      display: none;
    }
  }

  .top-nav-container {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 6px 0 10px;


    .logo {
      font-size: 16px;
      font-weight: 600;
      margin-right: .1rem;
      color: white;
      height: 50px;
      width: 80px;
      background-size: 290% 100%;
      background-position: 0 -2px;
    }

    .nav-item {
      position: relative;
      padding: 0 .15rem;
      font-size: 16px;
      font-weight: 600;
      height: 100%;

      a {
        &:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
      }
    }

    .main-nav {
      flex: 6 1 auto;
      height: 100%;
      color: white;

      .main-nav-list {
        position: relative;
        display: flex;
        align-items: center;
        height: 100%;

        @media screen and (max-width: 414px) {
          .nav-list-container {
            width: 60px;
            height: 100%;

            .nav-list {
              display: none;
            }

            .nav-mini-device-wrapper {
              position: relative;
              height: 100%;

              .nav-place {
                display: flex;
                align-items: center;
                text-align: center;
                cursor: pointer;

                span {
                  white-space: nowrap;
                }

                .place-list-icon-collapse {
                  transform: rotate(180deg);
                  transition: transform .36s ease-out;
                }

                .place-list-icon-expand {
                  transform: rotate(0);
                  transition: transform .36s ease-out;
                }

                .place-expand-icon {
                  /* display: inline-block;
                  width: 0;
                  height: 0;
                  border-width: 20px 0 0 0;
                  border-style: solid;
                  border-color: white; */
                }
              }

              .nav-expand-list-show {
                height: 140px;
                transition: height .3s ease-out;
              }

              .nav-expand-list-hide {
                z-index: -100;
                opacity: 0;
                height: 0;
                transition: height .2s ease-in;
              }

              .nav-expand-list {
                position: absolute;
                z-index: 300;
                bottom: -0px;
                left: 0;
                width: 100%;
                transform: translateY(100%);
                background-color: white;
                overflow: hidden;
                color: #333;
                border-radius: 0 0 6px 6px;
                border: 1px solid #dcdcdc;
                /* box-shadow: 0 0 8px rgba($color: #989898, $alpha: 0.5); */

                div {
                  font-size: 12px;
                  height: 35px;
                  line-height: 35px;
                  border-bottom: 1px solid #dcdcdc;
                  padding: 0 10px;
                  cursor: default;
                  text-align: center;

                  &:last-child {
                    border: 0;
                  }
                }
              }
            }
          }
        }

        @media screen and (min-width: 415px) {
          .nav-list-container {
            flex: 2 0 auto;
            display: flex;
            align-items: center;
            justify-content: flex-start;

            .nav-list {
              display: flex;
              align-items: center;
              color: white;

              .nav-list-item {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 50px;
                font-weight: 600;
              }
            }

            .nav-mini-device-wrapper {
              display: none;
            }
          }
        }

        .nav-search {
          position: relative;
          flex: 1 2 auto;
          display: flex;
          align-items: center;
          justify-content: flex-end;

          .nav-search-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: white;
            padding-right: 10px;
            border-radius: 4px;

            input {
              font-size: 11px;
              width: 100%;
              min-width: 80px;
              padding: .06rem 0 .06rem .1rem;
              color: #333;
            }
          }

          .search-icon {
            /* position: absolute;
            right: 24px;
            top: 50%;
            z-index: 100;
            transform: translateY(-50%); */
            color: #989898;
            font-size: 14px;
            cursor: pointer;
            margin-left: 10px;
          }
        }

        .nav-avatar {
          position: relative;
          flex-shrink: 0;
          width: 70px;
          height: 100%;

          .user-avatar {
            color: #787878;
            border-radius: 50%;
            padding: 2px;
            background-color: #fff;

            .avatar {
              background-color: #f2f2f2;
              border-radius: 50%;
            }
          }

          .avatar-placeholder {
            font-size: 32px;
            color: white;
          }

          .not-login-btn {
            font-size: 14px;
            padding: 2px 10px;
            color: white;
            border: 1px solid;
            border-radius: 4px;
          }
        }

        .user-setting-cover {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 100%;
          height: 100%;
          z-index: 301;
          transform: translate(-50%, -50%);
          background-color: #2f54eb;
        }

        .user-setting-pane-show {
          transform: translateY(100%) !important;
          transition: transform .32s ease-out;
        }

        .user-setting-pane-hide {
          transform: translateY(-100%) !important;
          transition: transform .36s ease-in;
        }

        .user-setting-pane {
          position: absolute;
          bottom: 0;
          /* left: 0; */
          z-index: 300;
          transform: translateY(-100%);
          background-color: white;
          color: #333;
          border: 1px solid #dcdcdc;
          border-radius: 0 0 4px 4px;

          .user-setting-item {
            padding: 10px 6px;
            font-size: 12px;
            text-align: center;
            cursor: pointer;
            white-space: nowrap;
            border-bottom: 1px solid #dcdcdc;

            &:last-child {
              border: none;
            }
          }

          .user-name {
            white-space: nowrap;
            max-width: 60px;
          }
        }

      }
    }
  }
</style>