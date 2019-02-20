import router from '../router'
import store from '../store'

router.beforeEach((to, from, next) => {
  store.commit('UPDATE_LOADING_STATUS', true) // 全局加载提示
  if (to.path === '/login') {
    next()
  } else {
    if (store.getters.login === false) {
      next({ path: '/login' })
    } else {
      next()
    }
  }
})

router.afterEach((to, from, next) => {
  store.commit('UPDATE_LOADING_STATUS', false)
})
