<template>
    <div class="container" @click="itemClick(item)" :class="{containerDelay: item.udf5}">
        <div class="img">
            <!--img v-if="item.taskType.includes('PF')" class="img-item" src="../../static/airplane_green-36.png"/>
            <img v-else-if="item.taskType.includes('T')" class="img-item" src="../../static/airplane_blue-36.png"/-->
            <img v-if="item.state === 'unrelease'" class="img-item" src="../../static/airplane_green-36.png"/>
            <img v-else class="img-item" src="../../static/airplane_blue-36.png"/>
        </div>
        <div class="content">
            <div class="header">
                <span>{{item.acReg}}</span>
                <span class="lay-type">{{item.taskType}}</span>
                <span class="lay-content">{{item.acPlace}}</span>
                <span class="lay-content">{{item.arrApt}}</span>
                <span v-if="item.arriveFlightNo !== undefined && item.arriveFlightNo !== ''" class="lay-content">{{item.arriveFlightNo}}</span>
                <span v-else class="lay-content">{{item.leaveFlghtNo}}</span>
                <!--span v-if="item.taskType.includes('AF')" class="lay-content">{{item.arriveFlightNo}}</span>
                <span v-else-if="item.taskType.includes('PF')" class="lay-content">{{item.leaveFlightNo}}</span>
                <span v-else class="lay-content">{{item.arriveFlightNo}}/{{item.leaveFlightNo}}</span-->
            </div>
            <div>
                <!--span class="time">{{item.arriveTime | parseTime('{m}-{d} {h}:{i}')}}--{{item.leaveTime | parseTime('{m}-{d} {h}:{i}')}}</span-->
                <span v-if="item.arriveTime !== undefined && item.arriveTime !== ''" class="time">{{item.arriveTime | parseTime('{m}-{d} {h}:{i}')}}</span>
                <span v-if="item.arriveTime !== undefined && item.leaveTime !== undefined && item.arriveTime !== '' && item.leaveTime !== ''" class="time">--</span>
                <span v-if="item.leaveTime !== undefined && item.leaveTime !== ''" class="time">{{item.leaveTime | parseTime('{m}-{d} {h}:{i}')}}</span>
                <span v-if="item.handShiftInfo !== undefined && item.handShiftInfo !== '' && item.recieveShiftInfo !== undefined && !item.recieveShiftInfo.includes('-recieved-')" class="shift-content">已交班</span>
                <span v-if="item.delFlag !== undefined && item.delFlag === '1'" class="shift-content">已取消</span>
            </div>
        </div>
        <div class="badge">
            <badge v-if="item.udf1 === '1'" :text="badgeText"></badge>
            <badge v-if="item.state === 'unrelease'" text="可放"></badge>
        </div>
        <div class="download" v-if="belong === 'my'"  v-on:click.stop="handleData">
            <x-button  type="primary" :text="loadText" :show-loading="loading" :mini="true"></x-button>
            <!-- <x-button v-if="item.udf3 === '1'" type="primary" text="上传" :show-loading="loading" :mini="true"></x-button> -->
        </div>
    </div>
</template>

<script>
import { Badge, XButton, cookie } from 'vux'
// import { downloadData } from '@/api/task'
import { showAlertAuto } from '@/utils/index'
export default {
  name: 'taskitem',
  data () {
    return {
      badgeText: '变更',
      loading: false,
      loadText: '下载'
    }
  },
  mounted () {
    window.document.addEventListener('message', this.messageListener)
    window.postMessage('checkPost:' + this.item.mdLayoverTaskId, '*')
  },
  destroyed () {
    // alert('destroyed')
    window.document.removeEventListener('message', this.messageListener)
  },
  props: {
    item: {
      type: Object,
      default: null
    },
    path: {
      type: String,
      default: ''
    },
    belong: {
      type: String,
      default: 'my'
    }
  },
  components: {
    Badge,
    XButton
  },
  methods: {
    itemClick (val) {
      window.postMessage('updateCurrentTaskid:' + this.item.mdLayoverTaskId, '*')
      this.$router.push({ path: this.path, query: { item: this.item, belong: this.belong, udf1: this.item.udf1, taskid: this.item.mdLayoverTaskId, acid: this.item.acReg } })
    },
    handleData () {
      let username = cookie.get('username')
      let userid = cookie.get('userid')
      if (this.loading) {
        return
      }
      this.loading = true
      if (this.loadText === '上传') {
        window.postMessage('doPost:' + this.item.mdLayoverTaskId, '*')

        // 上传/下载  文本的切换是通过RN发过来的message来确定的 在mounted()里
        // downloadData({taskid: this.item.mdLayoverTaskId}).then(response => {
        //   let data = response.data
        //   if (data.result === 'success') {
        //     window.postMessage('doPost:' + this.item.mdLayoverTaskId, '*')
        //   } else {
        //     showAlertAuto('提示！', '数据上传失败！')
        //     this.loading = false
        //   }
        // }).catch(e => {
        //   this.loading = false
        // })
      } else if (this.loadText === '下载') {
        window.postMessage('offlinedtask:' + JSON.stringify({userid: userid, username: username, taskid: this.item.mdLayoverTaskId}), '*') //  往RN发送消息
        // downloadData({taskid: this.item.mdLayoverTaskId}).then(response => {
        //   let data = response.data
        //   if (data.result === 'success') {
        //     window.postMessage('offlinedtask:' + JSON.stringify({userid: userid, username: username, taskid: this.item.mdLayoverTaskId}), '*') //  往RN发送消息
        //   } else {
        //     showAlertAuto('提示！', '数据下载失败！')
        //     this.loading = false
        //   }
        // }).catch(e => {
        //   this.loading = false
        // })
        // window.postMessage('download:' + JSON.stringify(this.item), '*')
      }
    },
    messageListener (msg) {
      let dataArr = msg.data.split(':')
      if (msg.data === 'downloadFinish:yes:' + this.item.mdLayoverTaskId) {
        this.loading = false
        showAlertAuto('下载成功')
        window.postMessage('checkPost:' + this.item.mdLayoverTaskId, '*')
      } else if (msg.data === 'downloadFinish:no:' + this.item.mdLayoverTaskId) {
        this.loading = false
        showAlertAuto('下载失败')
        window.postMessage('checkPost:' + this.item.mdLayoverTaskId, '*')
      } else if (dataArr[0] === 'doPostFinish' + this.item.mdLayoverTaskId) {
        this.loading = false
        showAlertAuto('上传完毕,一共' + dataArr[1] + '条签名，成功' + dataArr[2] + '条')
        window.postMessage('checkPost:' + this.item.mdLayoverTaskId, '*')
      } else if (dataArr[0] === 'offlinePost' + this.item.mdLayoverTaskId) {
        if (dataArr[1] === 'yes') {
          this.loadText = '上传'
        } else if (dataArr[1] === 'no') {
          this.loadText = '下载'
        }
      }
    }
  }
}
</script>

<style scoped>
.container {
  height: 50px;
  padding-left: 18;
  padding-right: 18;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 0.045rem solid #f1f1f1;
  padding: 0.7rem 0.4rem;
}
.containerDelay {
  background-color: #FCD6C4;
}
.img {
  flex: 1;
}
.img-item {
  width: 36px;
  height: 36px;
}
.content {
  flex: 7;
  align-items: flex-start;
}
.badge {
  flex: 1;
}
.download {
  flex: 2;
}
.header {
  color: black;
  font-size: 16px;
  font-weight: 400;
}
.lay-type {
  color: chocolate;
  font-weight: 500;
  margin-left: 3px;
}
.lay-content {
  color: black;
  font-weight: 500;
  margin-left: 3px;
}
.shift-content {
  color: red;
  font-size: 16px;
  font-weight: 400;
  margin-left: 3px;
}
.time {
  color: green;
  font-size: 16px;
  font-weight: 400;
}
</style>
