<template>
    <div>
        <x-header class="header-bar" :left-options="{showBack: true, preventGoBack: true}" @on-click-back="refreshMsgList">消息内容</x-header>
        <div>
            <x-input disabled :value="title"></x-input>
            <x-textarea :readonly="true" :max="200" :value="content"></x-textarea>
        </div>
    </div>
</template>

<script>
import { XHeader, XTextarea, XInput } from 'vux'
import { setMsgRead } from '@/api/message'
import { bus } from '../../main'
export default {
  data () {
    return {
      title: '',
      content: '',
      msgId: '',
      read: ''
    }
  },
  components: {
    XHeader,
    XTextarea,
    XInput
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.title = to.query.title
      vm.content = to.query.content
      vm.msgId = to.query.msgid
      vm.read = to.query.read
      if (vm.read === '0') {
        vm.setReadFlag(vm.msgId)
      }
    })
  },
  methods: {
    setReadFlag (val) {
      setMsgRead({msgid: val}).then(response => {
        bus.$emit('refreshMsgCount')
        console.log(response.data.result)
      })
    },
    refreshMsgList () {
      if (this.read === '0') {
        bus.$emit('refresh')
      }
      this.$router.back(-1)
    }
  }
}
</script>

<style scoped>
</style>
