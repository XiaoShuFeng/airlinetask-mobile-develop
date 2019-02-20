<template>
    <div>
        <div class="default-view">
            <transition name="fade">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </transition>
        </div>
        <app-footer :tab-items="tabItems" tab-tag="mytask"></app-footer>
    </div>
</template>

<script>
import AppFooter from '@/components/footer'
import 'vue-awesome/icons/user'
import 'vue-awesome/icons/users'
import 'vue-awesome/icons/cube'
import 'vue-awesome/icons/comment'
import { getMsgCount } from '@/api/message'
import { bus } from '../main'
export default {
  name: 'main-task-page',
  data () {
    return {
      tabItems: [
        { title: '我的任务', icon: 'user', scale: '1.5', actived: true, path: '/index/mytask' },
        { title: '全部任务', icon: 'users', scale: '1.5', actived: false, path: '/index/alltask' },
        { title: '航材查询', icon: 'cube', scale: '1.5', actived: false, path: '/index/matsearch' }
        // { title: '我的消息', icon: 'comment', scale: '1.5', actived: false, path: '/index/message' }
      ]
    }
  },
  components: {
    AppFooter
  },
  mounted () {
    this.getUnReadMsgCount()
    bus.$on('refreshMsgCount', () => {
      this.getUnReadMsgCount()
      /* if (Number.parseInt(this.$store.getters.msgCount) > 0) {
        for (let item of this.tabItems) {
          if (item.badge !== undefined) {
            this.$store.commit('SET_MSG_COUNT', this.$store.getters.msgCount - 1)
            delete item.badge
            Object.assign(item, {badge: this.$store.getters.msgCount.toString()})
          }
        }
      } */
    })
  },
  methods: {
    getUnReadMsgCount () {
      getMsgCount().then(response => {
        let data = response.data
        this.$store.commit('SET_MSG_COUNT', data.count)
        this.tabItems.forEach((v, k) => {
          if (v.icon === 'comment') {
            this.tabItems.splice(k, 1)
          }
        })
        if (this.$store.getters.msgCount > 0) {
          this.tabItems.push({ title: '我的消息', icon: 'comment', scale: '1.5', actived: false, path: '/index/message', badge: this.$store.getters.msgCount })
        } else {
          this.tabItems.push({ title: '我的消息', icon: 'comment', scale: '1.5', actived: false, path: '/index/message' })
        }
      })
    }
  }
}
</script>