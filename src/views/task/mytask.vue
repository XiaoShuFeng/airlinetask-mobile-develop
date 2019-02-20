<template>
    <div>
        <x-header class="header-bar" :right-options="{showMore: true}" @on-click-more="showMenu = true" :left-options="{showBack: false}">航线任务</x-header>
        <div class="task-view">
            <card :header="{title: '欢迎您：' + userName}">
                <div slot="content" class="card-demo-flex card-demo-content01">
                    <!--div class="vux-1px-l vux-1px-r" @click="getUnShiftList()">
                        <router-link to="">
                            <span>{{unShift}}</span>
                            <br/>
                            待接班
                        </router-link>
                    </div-->
                    <div class="vux-1px-r" @click="stateClick('unaccept')">
                        <router-link to="">
                            <span>{{unaccept}}</span>
                            <br/>
                            待接收
                        </router-link>
                    </div>
                    <div class="vux-1px-r" @click="stateClick('unfinish')">
                        <router-link to="">
                            <span>{{unfinish}}</span>
                            <br/>
                            待完成
                        </router-link>
                    </div>
                    <div class="vux-1px-r" @click="stateClick('finished')">
                        <router-link to="">
                            <span>{{finished}}</span>
                            <br/>
                            已完成
                        </router-link>
                    </div>
                    <div class="vux-1px-r" @click="stateClick('unrelease')">
                        <router-link to="">
                            <span>{{unrelease}}</span>
                            <br/>
                            待放行
                        </router-link>
                    </div>
                    <div class="vux-1px-r" @click="stateClick('released')">
                        <router-link to="">
                            <span>{{released}}</span>
                            <br/>
                            已放行
                        </router-link>
                    </div>
                </div>
            </card>
        </div>
        <div>
            <scroller ref="tasklist" :on-refresh="refresh" :on-infinite="infinite" class="scroller-view" height="80%">
                <group :title="listTitle" label-width="5.5em" label-margin-right="2em" label-align="justify">
                    <taskitem v-for="(item, index) in items" :key="index" :item="item" path="/index/taskitem" belong="my"></taskitem>
                </group>
            </scroller>
        </div>
        <div v-transfer-dom>
            <actionsheet :menus="menus" v-model="showMenu" show-cancel @on-click-menu="menuClick"></actionsheet>
        </div>
    </div>
</template>

<script>
import { XHeader, Card, Actionsheet, TransferDom, Group, cookie } from 'vux'
import { mapGetters } from 'vuex'
import { fetchTaskAssignInfo, fetchMyTaskInfo, fetchMyTaskList } from '@/api/task'
import taskitem from '@/components/taskitem'
import { logoutByUsername } from '@/api/login'
import { handleTaskArr } from '@/utils/data'
import { showAlertAuto } from '@/utils/index'
import { bus } from '../../main'
// import { setTimeout } from 'timers'
export default {
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Card,
    Actionsheet,
    taskitem,
    Group
  },
  computed: {
    ...mapGetters([
      'userName'
    ])
  },
  data () {
    return {
      unrelease: 0,
      unaccept: 0,
      unfinish: 0,
      released: 0,
      finished: 0,
      showMenu: false,
      menus: {
        exit: '退出登录' // manual: '手册查询'
      },
      items: [],
      total: 0,
      listQuery: {
        page: 1,
        rows: 10,
        sort: 'b.createTime',
        order: 'desc',
        state: 'unfinish'
      },
      listTitle: '待完成'
    }
  },
  created () {
    bus.$on('refreshMyTask', () => {
      this.listQuery.page = 1
      this.getMyTaskInfo()
      this.getList()
    })
  },
  mounted () {
    this.getMyTaskInfo()
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
    getMyTaskInfo () {
      fetchMyTaskInfo().then(response => {
        if (response.data.result === 'success') {
          this.unaccept = response.data.unaccept
          this.unfinish = response.data.unfinish
          this.unrelease = response.data.unrelease
          this.released = response.data.released
          this.finished = response.data.finished
          response.data.username = cookie.get('username')
          window.postMessage('taskinfo:' + JSON.stringify(response.data), '*') //  离线存储任务总览数据
          setTimeout(() => {
            window.postMessage('checkPost', '*') // 查询是否有离线数据需要同步
          }, 100)
        }
      })
    },
    menuClick (menuKey, menuItem) {
      if (menuKey === 'exit') {
        this.$store.commit('UPDATE_LOADING_STATUS', true)
        logoutByUsername().then(response => {
          this.$store.commit('UPDATE_LOADING_STATUS', false)
          const data = response.data
          if (data.result === 'success') {
            this.$store.commit('UPDATE_LOGIN', false)
            this.$store.commit('SET_USER_ID', '')
            this.$store.commit('SET_USER_NAME', '')
            this.$store.commit('SET_USER_ROLES', '')
            this.$router.push({ path: '/' })
          } else {
            showAlertAuto('提示！', data.msg)
          }
        })
      } else if (menuKey === 'manual') {
        window.postMessage('manual')
      }
    },
    getList () {
      this.$store.commit('UPDATE_LOADING_STATUS', true)
      fetchMyTaskList(this.listQuery).then(response => {
        this.$store.commit('UPDATE_LOADING_STATUS', false)
        this.items = handleTaskArr(response.data.data)
        this.total = response.data.total
        response.data.username = cookie.get('username')
        // console.log(this.$store.getters)
        response.data.userid = this.$store.getters.userId
        // 只有 未完成任务数据 才离线
        if (this.listQuery.state === 'unfinish') {
          //  把任务列表本地化存储
          window.postMessage('list:' + JSON.stringify(response.data), '*') //  往RN发送消息
          // 遍历所有的任务，把它的详情数据也进行离线下载 电签相关数据这里不下载 放RN里进行操作
          if (response.data.data.length > 0) {
            let list = response.data.data
            for (let i = 0; i < list.length; i++) {
              let queryParams = {
                acid: list[i].acReg,
                belong: list[i].belong,
                item: list[i],
                taskid: list[i].mdLayoverTaskId,
                udf1: list[i].udf1
              }
              fetchTaskAssignInfo(queryParams).then(response => {
                // debugger
                let data = response.data
                if (data.result === 'success') {
                  // showAlertAuto('提示！', '获取数据成功！')
                  response.data.username = cookie.get('username')
                  response.data.taskid = queryParams.taskid
                  setTimeout(() => {
                    window.postMessage('listdetail:' + JSON.stringify(response.data), '*') //  往RN发送消息
                  }, 100)
                } else {
                  showAlertAuto('提示！', '获取明细数据失败！')
                }
              })
            }
          }
        }
        this.bottom = this.items.length
        if (this.bottom > 0) {
          this.top = 1
        } else {
          this.top = 0
        }
      })
    },
    refresh (done) {
      if (this.listQuery.state === 'unShift') {
        done(true)
        return
      }
      this.getMyTaskInfo() // 刷新我的任务信息
      this.listQuery.page = 1
      fetchMyTaskList(this.listQuery).then(response => {
        this.items = handleTaskArr(response.data.data)
        this.total = response.data.total
        this.bottom = this.items.length
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
        }, 1000)
        return
      }
      this.listQuery.page = this.listQuery.page + 1
      fetchMyTaskList(this.listQuery).then(response => {
        this.items = handleTaskArr(this.items.concat(response.data.data))
        this.bottom = this.items.length
        done()
      }).catch(() => {
        done()
      })
    },
    stateClick (val) {
      switch (val) {
        case 'unaccept':
          this.listTitle = '待接收'
          break
        case 'unfinish':
          this.listTitle = '待完成'
          break
        case 'finished':
          this.listTitle = '已完成'
          break
        case 'unrelease':
          this.listTitle = '待放行'
          break
        case 'released':
          this.listTitle = '已放行'
          break
      }
      this.listQuery.state = val
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>

<style lang="less" scoped>
@import '~vux/src/styles/1px.less';
.scroller-view {
  margin-top: 160px;
}
.card-demo-flex {
  display: flex;
}
.card-demo-content01 {
  padding: 10px 0;
}
.card-padding {
  padding: 15px;
}
.card-demo-flex > div {
  flex: 1;
  text-align: center;
  font-size: 12px;
}
.card-demo-flex span {
  color: #f74c31;
}
.vux-1px-r span {
  font-size: 18px;
}
</style>
