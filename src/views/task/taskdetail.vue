<template>
    <div class="container">
        <x-header class="header-bar" :right-options="{showMore: false}" @on-click-back="goBack()" @on-click-more="showMenu = true" :left-options="{showBack: true, preventGoBack:true}">任务项</x-header>
        <form-preview style="margin-top: 46px;" header-label="机号" :header-value="acNo" :body-items="taskInfo" :footer-buttons="buttons"></form-preview>
        <cell v-if="queryParams.udf4 === '1'"
          class="change-info"
          title="变更信息"
          is-link
          :border-intent="true"
          :arrow-direction="showChangeInfo ? 'up' : 'down'"
          @click.native="showChange()">
        </cell>
        <template v-if="showChangeInfo">
            <cell-box v-for="(item, index) in changeInfoData" :key="index" class="change-item">{{item}}</cell-box>
        </template>
        <div class="item-list" v-if="myTasks.length > 0">
            <tasklist :items="myTasks" :belong="queryParams.belong" :taskId="taskId" title="我的任务"></tasklist>
        </div>
        <div class="item-list" v-if="myItems.length > 0">
            <itemlist :items="myItems" :belong="queryParams.belong" :taskId="taskId" title="我的工作条目" taskType = 'task'></itemlist>
        </div>
        <div class="item-list" v-if="taskItems.length > 0">
            <itemlist :items="taskItems" :belong="queryParams.belong" :taskId="taskId" title="其他工作条目" taskType = 'jc'></itemlist>
        </div>
        <div v-transfer-dom>
          <confirm v-model="cardVisible" show-input ref="shiftInfo" title="输入交班备注" @on-cancel="shiftCancel('team')" @on-confirm="shiftConfirm('team')">
          </confirm>
        </div>
        <div v-transfer-dom>
          <confirm v-model="cardVisibleUser" show-input ref="shiftInfoUser" title="输入接班备注" @on-cancel="shiftCancel('person')" @on-confirm="shiftConfirm('person')">
          </confirm>
        </div>
        <div v-transfer-dom>
            <actionsheet :menus="menus" v-model="showMenu" show-cancel @on-click-menu="menuClick"></actionsheet>
        </div>
        <div v-transfer-dom>
          <confirm v-model="showAlert"
              title="操作提示"
              @on-cancel="onCancel"
              @on-confirm="onConfirm">
              <p style="text-align:center;">确定执行放行操作吗？</p>
          </confirm>
        </div>
    </div>
</template>

<script>
import { XHeader, FormPreview, XInput, XButton, Group, Cell, CellBox, TransferDom, Actionsheet, Confirm, XTextarea } from 'vux'
import tasklist from '@/components/tasklist'
import itemlist from '@/components/itemlist'
import { fetchTaskAssignInfo, taskOperation, shiftWork, releaseFlight, closeTaskNotice } from '@/api/task'
import { showAlertAuto, parseTime } from '@/utils/index'
import { bus } from '../../main'
export default {
  data () {
    return {
      queryParams: { },
      myTasks: [],
      myItems: [],
      myTasksVisible: false,
      taskItems: [],
      acNo: '',
      taskInfo: [],
      buttons: [],
      taskId: 0,
      cardVisible: false,
      cardVisibleUser: false,
      menus: { team: '交班', person: '接班备注' },
      showMenu: false,
      currentIitem: {},
      showChangeInfo: false,
      changeInfoData: [],
      showAlert: false,
      personState: ''
    }
  },
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    FormPreview,
    itemlist,
    tasklist,
    XInput,
    XButton,
    Group,
    Cell,
    CellBox,
    Actionsheet,
    Confirm,
    XTextarea
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.queryParams = to.query
      vm.taskId = to.query.item.mdLayoverTaskId
      vm.getTaskInfo()
    })
  },
  mounted () {
    // window.addEventListener('message', (textVal) => {  // 接收来自RN的消息
      // debugger
      // let data = textVal.data
      // alert(data)
    // })
  },
  methods: {
    getTaskInfo () {
      this.acNo = this.queryParams.item.acReg
      this.taskInfo = [{label: '机型', value: this.queryParams.item.acType},
                       {label: '任务类型', value: this.queryParams.item.taskType},
                       {label: '停机位', value: this.queryParams.item.acPlace},
                       {label: '进港航班号', value: this.queryParams.item.arriveFlightNo},
                       {label: '出港航班号', value: this.queryParams.item.leaveFlghtNo},
                       {label: '内容描述', value: this.queryParams.item.remark}]
      if (this.queryParams.item.taskType === 'AF') {
        this.taskInfo.push({label: '进港时间', value: parseTime(this.queryParams.item.arriveTime, '{m}-{d} {h}:{i}')})
      } else if (this.queryParams.item.taskType === 'PF') {
        this.taskInfo.push({label: '出港时间', value: parseTime(this.queryParams.item.leaveTime, '{m}-{d} {h}:{i}')})
      } else {
        this.taskInfo.push({label: '进港时间', value: parseTime(this.queryParams.item.arriveTime, '{m}-{d} {h}:{i}')})
        this.taskInfo.push({label: '出港时间', value: parseTime(this.queryParams.item.leaveTime, '{m}-{d} {h}:{i}')})
      }
      this.$store.commit('UPDATE_LOADING_STATUS', true)
      fetchTaskAssignInfo(this.queryParams).then(response => {
        let data = response.data
        if (data.result === 'success') {
          // 交班信息
          if (data.shiftinfo !== undefined && data.shiftinfo !== '') {
            this.taskInfo.push({label: '交班描述', value: data.shiftinfo})
          }
          // 相关人员
          if (data.partners !== undefined && data.partners !== '') {
            this.taskInfo.push({label: '相关人员', value: data.partners})
          }
          // 变更提醒
          if (this.queryParams.udf1 === '1') {
            this.changeInfoData = data.notice.split(';')
          }
          this.myTasks = data.tasklist
          this.myItems = data.itemlist
          this.taskItems = data.jclist
          if (this.myTasks.length > 0) {
            this.myTasksVisible = true
          }
          this.personState = data.personalstate
          this.initButtons()
        } else {
          showAlertAuto('提示！', '获取数据失败！')
          this.myTasks = []
          this.taskItems = []
        }
        this.$store.commit('UPDATE_LOADING_STATUS', false)
      })
    },
    menuClick (menuKey, menuItem) {
      if (menuKey === 'team') {
        this.cardVisible = true
      } else if (menuKey === 'person') {
        this.cardVisibleUser = true
      }
    },
    initButtons () {
      this.buttons = [{ style: 'primary', text: '刷新', onButtonClick: () => { this.buttonClickAction('refresh') } },
                        { style: 'primary', text: '勤务', onButtonClick: () => { this.buttonClickAction('service') } },
                        { style: 'primary', text: '维修', onButtonClick: () => { this.buttonClickAction('technic') } },
                        { style: 'primary', text: '放行', onButtonClick: () => { this.buttonClickAction('release') } },
                        { style: 'primary', text: '接机', onButtonClick: () => { this.buttonClickAction('pickup') } },
                        { style: 'primary', text: '送机', onButtonClick: () => { this.buttonClickAction('transfers') } }]
      if (this.personState !== 'nothing') {
        if (this.personState === 'unaccept') { // 待接收处理
          this.buttons = [{ style: 'primary', text: '接收', onButtonClick: () => { this.buttonClickAction('accept') } }]
        } else if (this.personState !== 'finished') {  // 交班
          this.buttons.push({ style: 'primary', text: '交班', onButtonClick: () => { this.buttonClickAction('shiftwork') } })
        }
      }
    },
    buttonClickAction (val) {
      if (val === 'shiftwork') {
        this.showMenu = true
      /* } else if (val === 'Finished') { // 放行
        this.showAlert = true
      } else if (val === 'Trouble') { // 故障录入
        this.$router.push({ path: '/index/trouble' }) */
      } else if (val === 'refresh') {
        this.getTaskInfo()
      } else {
        // 接收任务或领取任务
        taskOperation({taskid: this.taskId, state: val}).then(response => {
          let data = response.data
          if (data.result === 'success') {
            showAlertAuto('提示！', '任务操作成功！')
            this.getTaskInfo()
            /*
            if (val === 'service' || val === 'technic' || val === 'release' || val === 'pickup' || val === 'transfers') {
              this.$router.push({ path: '/index/mytask' }) // 注释原因：多次领取任务，停在原来页面
              bus.$emit('refreshMyTask')
            } */
          } else {
            showAlertAuto('提示！', data.info)
          }
        })
      }
    },
    shiftConfirm (val) {
      let shiftInfo = ''
      if (val === 'team') {
        shiftInfo = this.$refs.shiftInfo.msg
      } else {
        shiftInfo = this.$refs.shiftInfoUser.msg
      }
      shiftWork({taskid: this.queryParams.item.mdLayoverTaskId, shiftinfo: shiftInfo, shifttype: val}).then(response => {
        let data = response.data
        if (data.result === 'success') {
          this.cardVisible = false
          showAlertAuto('提示！', '任务交接成功！')
        } else {
          showAlertAuto('提示！', data.info)
        }
      })
    },
    shiftCancel (val) {
      if (val === 'team') {
        this.cardVisible = false
      } else {
        this.cardVisibleUser = false
      }
    },
    showChange () {
      this.showChangeInfo = !this.showChangeInfo
      closeTaskNotice({taskid: this.taskId}).then(response => {
        if (response.data.result === 'fail') {
          showAlertAuto('提示！', response.data.info)
        }
      })
    },
    goBack () {
      bus.$emit('refreshMyTask')
      this.changeInfoData = []
      this.$router.back(-1)
    },
    onCancel () {
      this.showAlert = false
    },
    onConfirm () {
      this.$store.commit('UPDATE_LOADING_STATUS', true)
      releaseFlight({taskid: this.queryParams.item.mdLayoverTaskId, force: '0'}).then(response => {
        this.$store.commit('UPDATE_LOADING_STATUS', false)
        let data = response.data
        if (data.result === 'success') {
          showAlertAuto('提示！', '飞机放行成功！')
        } else {
          showAlertAuto('提示！', data.info)
        }
      })
    }
  }
}
</script>

<style scoped>
.container {
  background-color: white;
}
.header-bar {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 20;
}
.user-card {
  margin-top: 5px;
  margin-left: 20px;
  margin-right: 20px;
}
.assign-list {
  margin-top: 30px;
}
.item-list {
  margin-top: 30px;
  margin-bottom: 50px;
}
.cell-item {
  border-bottom: 0.045rem solid #f1f1f1;
}
.change-item {
  color: #888;
}
.change-info{
  color: red;
}
</style>
