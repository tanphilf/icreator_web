import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '@/views/home.vue'
import index from '@/views/index/index.vue'

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
    children: [
      {
        path: '/index',
        name: 'index',
        component: index,
      },
    ]
  },
  {
    path: '/detail/:id',
    name: 'detail',
    component: () => import(/* webpackChunkName: "detail" */'@/views/detail/detail.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */'@/views/login/login.vue'),
  },
  {
    path: '/publish',
    name: 'publish',
    component: () => import(/* webpackChunkName: "publish" */'@/views/publish/publish.vue'),
  },
  {
    path: '/search',
    name: 'search',
    component: () => import(/* webpackChunkName: "search" */'@/views/search/search.vue'),
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import(/* webpackChunkName: "setting" */'@/views/setting/setting.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


export default router
