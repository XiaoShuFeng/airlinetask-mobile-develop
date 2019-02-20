// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import router from './router'
import store from './store'
import './utils/permission'
// import './mock'
import VueScroller from 'vue-scroller'
import * as filters from './filters'

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(VueScroller)
Vue.use(VueRouter)

FastClick.attach(document.body)

Vue.config.productionTip = false

var bus = new Vue()
/* eslint-disable no-new */
new Vue({
  el: '#app-box',
  router,
  store,
  render: h => h(App)
})

export { bus }
