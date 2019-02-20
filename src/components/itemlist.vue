<template>
    <div class="item-container">
        <group :title="title">
            <!-- 自己的工作单 -->
            <div v-if="taskType === 'task'" class="cell-item" v-for="(item, index) in items" :key="index" @click="buttonClick(item.taskAssignId, item.taskState, item.dataType, item.jcId, item.layoverJcId, item.isCancel)">
                <cell :title="item.taskNo" :inline-desc="item.description">
                    <div>
                        <span v-if="item.isCancel === '2' || item.isCancel === '3'" style="color: green">申请取消</span>
                        <span v-else-if="item.isCancel === '1'" style="color: green">已取消</span>
                        <span v-else style="color: green">{{item.taskState | parseWorkState}}</span>
                        <span v-if="item.dataType !== 'TD航线'" style="color: red">非电签</span>
                    </div>
                </cell>
            </div>
            <!-- 剩余的工作单 -->
            <div v-if="taskType === 'jc'" class="cell-item" v-for="(item, index) in items" :key="index" @click="jcButtonClick(item.id, item.jcType, item.worktype, item.layoverJcId)">
                <cell :title="item.jcNumber" :inline-desc="item.description">
                    <div>
                        <span style="color: green">{{item.worktype}}</span>
                        <span v-if="item.worktype !== 'TD航线'" style="color: red">非电签</span>
                    </div>
                </cell>
            </div>
        </group>
        <div v-transfer-dom>
            <actionsheet :menus="menus" show-cancel v-model="showMenu" @on-click-menu="menuClick"></actionsheet>
        </div>
        <div v-transfer-dom>
          <confirm v-model="cardVisible" show-input ref="delayInfo" title="输入取消原因" @on-cancel="delayCancel" @on-confirm="delayConfirm">
          </confirm>
        </div>
        <div v-transfer-dom>
          <confirm v-model="showAlert"
              title="操作提示"
              @on-cancel="onCancel"
              @on-confirm="onConfirm">
              <p style="text-align:center;">确定执行完成操作吗？</p>
          </confirm>
        </div>
    </div>
</template>

<script>
import { Group, Cell, Actionsheet, TransferDom, Confirm } from 'vux'
import { itemOperation, delayJcTask, packageHxJc } from '@/api/task'
import { showAlertAuto } from '@/utils/index'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      menus: {},
      showMenu: false,
      currentId: '',
      currentState: '0',
      currentType: '',
      currentJcId: '',
      currentLayoverJcId: '',
      cardVisible: false,
      showAlert: false,
      confirmResult: false,
      isCancel: '0'
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
    belong: {
      type: String,
      default: 'my'
    },
    title: {
      type: String,
      default: ''
    },
    taskType: {
      type: String,
      default: 'task'
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
    window.document.addEventListener('message', msg => {
      let data = msg.data.split(':')
      if (data[0] === 'sign-info') {
        alert(data[0])
      }
    })
  },
  methods: {
    initButtons (taskState, jctype) {
      this.menus = {}
      if (this.isCancel === '1' || this.isCancel === '2' || this.isCancel === '3') {
        return
      }
      // 上传图片都显示
      this.menus = { uploadPhoto: '上传图片' }
      // 电签和预览
      if (jctype === 'TD航线' && this.currentJcId !== undefined && this.currentJcId !== '') {
        if (taskState === 'on-work') {
          Object.assign(this.menus, { preview: '工卡签署/电签工卡' })
        } else {
          Object.assign(this.menus, { preview: '预览' })
        }
      } else {
        delete this.menus.preview
      }
      // 领取，待确认
      if (taskState === 'apply') {
        delete this.menus.uploadPhoto
      } else if (taskState === 'unaccept') {
        // 待接收，接收
        this.menus = { accept: '接收' }
      } else if (taskState === 'accept') {
        // 已接收
        Object.assign(this.menus, { onWork: '开工' })
        // Object.assign(this.menus, { finished: '完成' })
        if (jctype === 'SAP附加') {
          Object.assign(this.menus, { delayWork: '申请取消' })
        }
      } else if (taskState === 'on-work') {
        // 已开工
        Object.assign(this.menus, { finished: '完成' })
        if (jctype === 'SAP附加') {
          Object.assign(this.menus, { delayWork: '申请取消' })
        }
      }
      // this.menus = { onWork: '开工', finished: '完成', delayWork: '申请取消', uploadPhoto: '上传图片' }
    },
    buttonClick (id, taskState, jcType, jcid, layoverjcid, isCancel) {
      this.currentId = id
      this.showMenu = true
      this.isCancel = isCancel
      this.currentJcId = jcid
      this.currentLayoverJcId = layoverjcid
      // 只有开工的工卡才能电签
      if (taskState === 'on-work') {
        this.currentState = '1'
      } else {
        this.currentState = '0'
      }
      this.initButtons(taskState, jcType)
    },
    jcButtonClick (id, jcType, worktype, layoverJcId) {
      if (this.belong === 'all' || worktype !== 'TD航线') {
        this.menus = {}
        return
      }
      /* if (jcType === '勤务工作' || jcType === '例行工作') {
        return
      }
      this.menus = { accept: '领取' } */
      if (worktype === 'TD航线' && this.belong === 'my') {
        Object.assign(this.menus, { preview1: '预览' })
      }
      this.currentId = id
      this.showMenu = true
      this.currentLayoverJcId = layoverJcId
    },
    menuClick (menuKey, menuItem) {
      if (menuKey === 'preview') {
        // 已分配工卡预览
        if (this.currentId === undefined || this.currentId === 0) {
          showAlertAuto('提示！', '任务还没确认！')
          return
        }
        if (this.currentLayoverJcId !== undefined && this.currentLayoverJcId !== '') {
          window.postMessage('preview:' + this.currentLayoverJcId + ':' + this.userId + ':' + this.userName + ':' + this.currentState)
        } else {
          packageHxJc({taskid: this.taskId, currentid: this.currentId, tasktype: this.taskType}).then(response => {
            let data = response.data
            this.currentLayoverJcId = data.jcid
            if (data.result === 'success') {
              window.postMessage('preview:' + this.currentLayoverJcId + ':' + this.userId + ':' + this.userName + ':' + this.currentState)
            } else {
              showAlertAuto('提示！', '工卡预览失败！' + data.msg)
            }
          })
        }
      } else if (menuKey === 'preview1') {
        if (this.currentLayoverJcId !== undefined && this.currentLayoverJcId !== '') {
          window.postMessage('preview:' + this.currentLayoverJcId + ':' + this.userId + ':' + this.userName + ':0')
        } else {
          packageHxJc({taskid: this.taskId, currentid: this.currentId, tasktype: 'jc'}).then(response => {
            let data = response.data
            this.currentLayoverJcId = data.jcid
            if (data.result === 'success') {
              window.postMessage('preview:' + this.currentLayoverJcId + ':' + this.userId + ':' + this.userName + ':0')
            } else {
              showAlertAuto('提示！', '工卡预览失败！' + data.msg)
            }
          })
        }
      } else if (menuKey === 'delayWork') {
        // 申请取消
        if (this.currentId === undefined || this.currentId === '' || this.currentId === 0) {
          showAlertAuto('提示！', '任务还没确认！')
          return
        }
        this.cardVisible = true
      } else if (menuKey === 'finished') {
        // 完工操作
        this.showAlert = true
      } else if (menuKey === 'uploadPhoto') {
        // 上传图片
        window.postMessage('photo:' + this.userId + ':' + this.taskId + ':' + this.currentId)
      } else if (menuKey === 'cancel') {
        this.showMenu = false
      } else {
        this.menuClickAction(menuKey)
      }
    },

    delayConfirm () {
      delayJcTask({itemid: this.currentId, itemtype: this.taskType, delayinfo: this.$refs.delayInfo.msg}).then(response => {
        if (response.data.result === 'fail') {
          showAlertAuto('提示！', '申请任务延期失败：' + response.data.info)
        } else {
          this.$parent.getTaskInfo()
          showAlertAuto('提示！', '申请任务延期成功！')
        }
      })
    },
    delayCancel () {
      this.cardVisible = false
    },
    onCancel () {
      this.showAlert = false
    },
    onConfirm () {
      this.menuClickAction('finished')
    },
    menuClickAction (state) {
      if (state === 'onWork') {
        state = 'on-work'
      }
      this.$store.commit('UPDATE_LOADING_STATUS', true)
      itemOperation({taskid: this.taskId, tasktype: this.taskType, currentid: this.currentId, state: state}).then(response => {
        let data = response.data
        if (data.result === 'success') {
          this.$parent.getTaskInfo()
          showAlertAuto('提示！', '任务操作成功')
        } else {
          showAlertAuto('提示！', '操作失败：' + data.info)
        }
        this.$store.commit('UPDATE_LOADING_STATUS', false)
      })
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
