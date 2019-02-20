import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'default',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login')
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('@/views/index'),
      children: [
        {
          path: 'mytask',
          component: () => import('@/views/task/mytask')
        },
        {
          path: 'alltask',
          component: () => import('@/views/task/alltask')
        },
        {
          path: 'taskitem',
          component: () => import('@/views/task/taskdetail')
        },
        {
          path: 'matsearch',
          component: () => import('@/views/mat/matlist')
        },
        {
          path: 'message',
          component: () => import('@/views/msg/msglist')
        },
        {
          path: 'trouble',
          component: () => import('@/views/trouble/troubleinput')
        },
        {
          path: 'msgdetail',
          component: () => import('@/views/msg/msgdetail')
        }
      ]
    }
  ]
})
