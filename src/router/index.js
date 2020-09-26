import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '@/views/home.vue'
import notFound from '@/views/notFound.vue'

Vue.use(VueRouter)

// 去掉跳转本身路由的错误提示
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: home,
    meta: {
      title: 'icreator - 创造属于你自己的知识领域'
    }
  },
  {
    path: '*',
    component: notFound,
    meta: {
      title: 'icreator - 404'
    }
  },
  {
    path: '/detail/:id',
    name: 'detail',
    component: () => import(/* webpackChunkName: "detail" */'@/views/detail/detail.vue'),
    meta: {
      title: 'icreator - 创造属于你自己的知识领域'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */'@/views/login/login.vue'),
    meta: {
      title: 'icreator - 登录'
    }
  },
  {
    path: '/publish',
    name: 'publish',
    component: () => import(/* webpackChunkName: "publish" */'@/views/publish/publish.vue'),
    meta: {
      title: 'icreator - 创建新文章'
    }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import(/* webpackChunkName: "search" */'@/views/search/search.vue'),
    meta: {
      title: 'icreator - 搜索内容'
    }
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import(/* webpackChunkName: "setting" */'@/views/setting/setting.vue'),
    meta: {
      title: 'icreator - 设置'
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title)
  {
    document.title = to.meta.title
  }
  next();
})


export default router
