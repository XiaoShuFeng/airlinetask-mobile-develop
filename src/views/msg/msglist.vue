<template>
    <div>
        <x-header class="header-bar" :left-options="{showBack: false}">消息列表</x-header>
        <search v-model="title" position="absolute" placeholder="搜索标题" auto-scroll-to-top top="46px" @on-cancel="onCancel" @on-submit="onSubmit" ref="msgSearch"></search>
        <div class="msg-list">
            <scroller ref="tasklist" :on-refresh="refresh" class="scroller-view" height="80%">
                <group v-if="unReadList.length > 0" title="未读消息">
                    <cell :title="item.title" is-link v-for="(item, index) in unReadList" :key="index" :link="{path: '/index/msgdetail', query: {msgid: item.messagerecieveid, read: item.read, title: item.title, content: item.content}}" :inline-desc="item.content">
                        <span slot="after-title" style="color:green;">{{ item.sendtime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                        <badge text="未读"></badge>
                    </cell>
                </group>
                <group v-if="msgList.length > 0" title="已读消息">
                    <cell :title="item.title" is-link v-for="(item, index) in msgList" :key="index" :link="{path: '/index/msgdetail', query: {msgid: item.messagerecieveid, read: item.read, title: item.title, content: item.content}}" :inline-desc="item.content">
                        <span slot="after-title" style="color:green;">{{ item.sendtime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                    </cell>
                </group>
            </scroller>
        </div>
    </div>
</template>

<script>
import { XHeader, Group, Cell, Search, Badge } from 'vux'
import { fetchMsgList } from '@/api/message'
import { bus } from '../../main'
export default {
  components: {
    XHeader,
    Group,
    Cell,
    Search,
    Badge
  },
  data () {
    return {
      msgList: [],
      unReadList: [],
      title: '',
      read: 0
    }
  },
  mounted () {
    this.getMsgList()
  },
  created () {
    bus.$on('refresh', () => {
      this.getMsgList()
    })
  },
  methods: {
    getMsgList () {
      this.getUnReadMsgList()
      this.getReadedMsgList()
      bus.$emit('refreshMsgCount')
    },
    getUnReadMsgList () {
      fetchMsgList({read: '0'}).then(response => {
        let data = response.data
        this.unReadList = data.msglist
      })
    },
    getReadedMsgList () {
      fetchMsgList({read: '1'}).then(response => {
        let data = response.data
        this.msgList = data.msglist
      })
    },
    searchMsgList () {
      fetchMsgList({title: this.title}).then(response => {
        this.unReadList = []
        this.msgList = response.data.msglist
      })
    },
    refresh (done) {
      this.getMsgList() // 刷新我的任务信息
      done()
    },
    onSubmit () {
      this.$refs.msgSearch.setBlur()
      this.searchMsgList()
    },
    onCancel () {
      this.getMsgList()
    }
  }
}
</script>

<style scoped>
.msg-list {
  margin-bottom: 50px;
}
.scroller-view {
  margin-top: 90px;
}
</style>

