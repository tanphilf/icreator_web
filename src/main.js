import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import image from '@/components/image/image'
import totast from '@/components/totast/totast'
import view from '@/components/view/view'
import list from '@/components/list/list'
import listItem from '@/components/list/listItem'
import swiper from '@/components/swiper/swiper'
import swiperItem from '@/components/swiper/swiperItem'
import headNav from '@/views/nav'
import bottomFooter from '@/views/footer'

// 富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import './assets/fonticon/iconfont.css';
import './global'
import '@/utils/doget'

import ajax from '@/utils/ajax'

Vue.config.productionTip = false

Vue.component('ximage', image)
Vue.component('totast', totast)
Vue.component('xview', view)
Vue.component('list', list)
Vue.component('listItem', listItem)
Vue.component('swiper', swiper)
Vue.component('swiperItem', swiperItem)
Vue.component('headNav', headNav)
Vue.component('bottomFooter', bottomFooter)

Vue.http = Vue.prototype.$http = ajax

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#icreator')
