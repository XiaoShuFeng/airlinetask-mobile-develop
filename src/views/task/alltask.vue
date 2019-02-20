<template>
    <div>
        <x-header class="header-bar" :right-options="{showMore: true}" :left-options="{showBack: false}" @on-click-more="showMenu = true">全部任务</x-header>
        <search v-model="listQuery.acreg" placeholder="搜索机号" position="absolute" auto-scroll-to-top top="46px" @on-cancel="onCancel" @on-submit="onSubmit" ref="taskSearch"></search>
        <div class="tasklist-view">
            <scroller ref="tasklist" :on-refresh="refresh" :on-infinite="infinite" class="scroller-view" height="90%">
                <!--group v-if="shiftItems.length > 0" title="交班任务" label-width="5.5em" label-margin-right="2em" label-align="justify">
                    <taskitem v-for="(item, index) in shiftItems" :key="index" :item="item" path="/index/taskitem" belong="all"></taskitem>
                </group-->
                <group title="全部任务" label-width="5.5em" label-margin-right="2em" label-align="justify">
                    <taskitem v-for="(item, index) in items" :key="index" :item="item" path="/index/taskitem" belong="all"></taskitem>
                </group>
            </scroller>
        </div>
        <div v-transfer-dom>
            <popup v-model="showMenu" position="right">
                <div style="width:300px;">
                  <p class="title">任务搜索</p>
                  <group>
                      <x-input title="机型：" label-width="100px" name="actype" v-model="listQuery.actype"></x-input>
                      <x-input title="机号：" label-width="100px" name="acreg" v-model="listQuery.acreg"></x-input>
                      <x-input title="航班号：" label-width="100px" name="flightno" v-model="listQuery.flightno"></x-input>
                      <x-input title="任务类型：" label-width="100px" name="tasktype" v-model="listQuery.tasktype"></x-input>
                  </group>
                  <box gap="30px 25px">
                      <x-button type="primary" @click.native="handleSearch">查找</x-button>
                  </box>
                </div>
            </popup>
        </div>
    </div>
</template>

<script>
import { XHeader, Search, Group, Popup, TransferDom, XInput, XButton, Box } from 'vux'
import taskitem from '@/components/taskitem'
import { fetchAllTaskList } from '@/api/task'
import { handleTaskArr } from '@/utils/data'
export default {
  data () {
    return {
      items: [],
      shiftItems: [],
      total: 0,
      listQuery: {
        page: 1,
        rows: 10,
        sort: 'a.createTime',
        order: 'desc',
        acreg: '',
        isshiftto: '0',
        flightno: '',
        tasktype: '',
        actype: ''
      },
      showMenu: false
    }
  },
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Search,
    taskitem,
    Group,
    Popup,
    XInput,
    XButton,
    Box
  },
  mounted () {
    this.getList()
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.path === '/index/taskitem') {
        setTimeout(() => { // 返回时滚动到离开时的位置
          vm.$refs.tasklist.scrollTo(vm.$store.getters.listPosition.left, vm.$store.getters.listPosition.top, false)
        }, 10)// 同步转异步操作
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    if (to.path === '/index/taskitem') { // 记录离开时的位置
      let pos = this.$refs.tasklist.getPosition()
      this.$store.commit('UPDATE_POSITION', pos)
    }
    next()
  },
  methods: {
    getList () {
      this.$store.commit('UPDATE_LOADING_STATUS', true)
      fetchAllTaskList(this.listQuery).then(response => {
        this.items = handleTaskArr(response.data.data)
        this.total = response.data.total
        this.bottom = this.items.length
        if (this.bottom > 0) {
          this.top = 1
        } else {
          this.top = 0
        }
        this.$store.commit('UPDATE_LOADING_STATUS', false)
      })
    },
    refresh (done) {
      this.listQuery.page = 1
      fetchAllTaskList(this.listQuery).then(response => {
        this.items = handleTaskArr(response.data.data)
        if (this.items.length > 0) {
          this.top = 1
        } else {
          this.top = 0
        }
        done()
      }).catch(() => {
        done()
      })
    },
    infinite (done) {
      if (this.bottom === undefined || this.total === undefined) {
        done(true)
        return
      }
      if (this.bottom >= this.total) {
        setTimeout(() => {
          done(true)
        }, 1500)
        return
      }
      this.listQuery.page = this.listQuery.page + 1
      fetchAllTaskList(this.listQuery).then(response => {
        this.items = this.items.concat(handleTaskArr(response.data.data))
        this.bottom = this.items.length
        done()
      }).catch(() => {
        done()
      })
    },
    setFocus () {
      this.$refs.taskSearch.setFocus()
    },
    onSubmit () {
      this.$refs.taskSearch.setBlur()
      this.listQuery.page = 1
      this.getList()
    },
    onCancel () {
      this.listQuery.page = 1
      this.listQuery.acReg = ''
      this.getList()
    },
    handleSearch () {
      this.showMenu = false
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>

<style lang="less" scoped>
.tasklist-view {
    margin-top: 48px;
    margin-bottom: 50px;
}
.scroller-view {
  margin-top: 90px;
}
.title {
  text-align: center;
  font-family: inherit;
  font-size: 20px;
  font-weight: bold;
  padding-bottom: 10px;
  margin-top: 20px;
}
</style>
