<template>
    <div class="item-container">
        <group :title="title" v-if="items.length > 0">
            <div class="cell-item" v-for="(item, index) in items" :key="index" @click="buttonClick(item.taskAssignId, item.workType, item.taskState)">
                <cell  :title="item.taskNo" :inline-desc="item.workType | parseWorkType">
                    <div>
                        <span style="color: green">{{item.taskState | parseWorkState}}</span>
                    </div>
                </cell>
            </div>
        </group>
        <div v-transfer-dom>
            <actionsheet :menus="menus" v-model="showMenu" show-cancel @on-click-menu="menuClick"></actionsheet>
        </div>
        <div v-transfer-dom>
          <confirm v-model="showAlert"
              @on-cancel="onCancel"
              @on-confirm="onConfirm"
              title="操作提示">
              <p style="text-align:center;">确定执行此操作吗？</p>
          </confirm>
        </div>
        <div v-transfer-dom>
          <confirm v-model="showAlertRelease"
              @on-cancel="onCancelRelease"
              @on-confirm="onConfirmRelease"
              title="操作提示">
              <p style="text-align:center;">{{alertInfo + ', 确定执行放行操作吗？'}}</p>
          </confirm>
        </div>
    </div>
</template>

<script>
import { Group, Cell, Actionsheet, TransferDom, Confirm } from 'vux'
import { assignTaskOperation, getReleaseInfo } from '@/api/task'
import { showAlertAuto } from '@/utils/index'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      menus: {},
      showMenu: false,
      currentId: '',
      showAlert: false,
      confirmResult: false,
      alertInfo: '',
      currentMenuKey: '',
      showAlertRelease: false
    }
  },
  props: {
    items: {
      type: Array,
      default: null
    },
    taskId: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: '我的任务'
    }
  },
  directives: {
    TransferDom
  },
  components: {
    Group,
    Cell,
    Actionsheet,
    Confirm
  },
  computed: {
    ...mapGetters([
      'userId',
      'userName'
    ])
  },
  mounted () {
  },
  methods: {
    buttonClick (assignId, workType, taskState) {
      this.currentId = assignId
      this.initButtons(workType, taskState)
      this.showMenu = true
    },
    initButtons (workType, taskState) {
      this.menus = {}
      if (taskState === 'finished') {
        return
      }
      if (taskState === 'unaccept') {
        this.menus = { accept: '接收' }
        return
      }
      if (taskState === 'apply') return
      if ((workType === 'pickup' || workType === 'technic') && taskState !== 'on-spot' && taskState !== 'unaccept') {           // 接机、维修人员菜单
        Object.assign(this.menus, { onspot: '到位' })
      } else if (workType === 'release' && taskState !== 'unaccept' && taskState !== 'released') {                              // 放行人员菜单
        Object.assign(this.menus, { release: '放行' })
      } else if (workType === 'transfers' && (taskState === 'released' || taskState === 'accept')) {                            // 送机人员菜单
        Object.assign(this.menus, { transfers: '推出机位' })
      } else if ((workType === 'service' || workType === 'technic') && taskState !== 'finished') {                              // 勤务、维修人员菜单
        Object.assign(this.menus, { finished: '完成' })
      }
    },
    menuClick (menuKey, menuItem) {
      this.currentMenuKey = menuKey
      if (menuKey === 'finished') {
        this.showAlert = true
      } else if (menuKey === 'cancel') {
        // return
      } else if (menuKey === 'release') {
        // 检查是否有其他人未完成，如果有，给出提示
        this.releaseOperation()
      } else {
        // this.taskOperation(menuKey)
        this.showAlert = true
      }
    },
    releaseOperation () {
      getReleaseInfo({assignid: this.currentId}).then(response => {
        let data = response.data
        if (data.result === 'success') {
          this.alertInfo = data.info
          this.showAlertRelease = true
        } else if (data.result === 'fail' && data.info === undefined) {
          this.taskOperation('release')
        }
      })
    },
    taskOperation (state) {
      assignTaskOperation({assignid: this.currentId, state: state}).then(response => {
        let data = response.data
        if (data.result === 'success') {
          this.$parent.getTaskInfo()
          showAlertAuto('提示！', '任务操作成功:')
        } else {
          showAlertAuto('提示！', '任务操作失败:' + data.info)
        }
      })
    },
    onCancel () {
      this.showAlert = false
    },
    onConfirm () {
      // this.taskOperation('finished')
      this.taskOperation(this.currentMenuKey)
    },
    onCancelRelease () {
      this.showAlertRelease = false
    },
    onConfirmRelease () {
      this.taskOperation('release')
    }
  }
}
</script>

<style scoped>
.item-container {
  padding-bottom: 5px;
}
.cell-item {
  border-bottom: 0.045rem solid #f1f1f1;
}
</style>
