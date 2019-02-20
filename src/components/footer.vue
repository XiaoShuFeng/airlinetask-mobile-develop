<template>
    <div>
        <tabbar class="fixed-bottom-bar" @on-index-change="tabChange">
            <tabbar-item v-for="(item, index) in tabItems" :key="index" :selected="item.actived" :badge="item.badge">  
                <icon :name="item.icon" :scale="item.scale" slot="icon"></icon>
                <span slot="label">{{item.title}}</span>
            </tabbar-item>
        </tabbar>
    </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vux'
import Icon from 'vue-awesome/components/Icon.vue'

export default {
  name: 'AppFooter',
  props: {
    tabItems: {
      type: Array,
      default: null
    }
  },
  components: {
    Tabbar,
    TabbarItem,
    Icon
  },
  data () {
    return {
    }
  },
  watch: {
    '$route': function (newV) { // 保持tabitem的选择状态和path一致
      let activeIndex = this.tabItems.findIndex(i => i.path === newV.path)
      if (activeIndex >= 0) {
        for (let i = 0; i < this.tabItems.length; i++) {
          if (activeIndex === i) {
            this.tabItems[i].actived = true
          } else {
            this.tabItems[i].actived = false
          }
        }
      }
    }
  },
  methods: {
    tabChange (val) {
      this.$router.push({ path: this.tabItems[val].path })
    }
  }
}
</script>

<style scoped>
.fixed-bottom-bar {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  z-index: 20;
}
</style>
