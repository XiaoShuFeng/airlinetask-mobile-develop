import request from '@/utils/request'
/** 根据状态查询任务情况 */
const fetchMyTaskList = (query) => {
  return request({
    url: '/AirlineTaskAction/getTaskListByState.do', // '/task/getMyTaskList',
    method: 'get',
    params: query
  })
}
/** 获取所有任务 */
const fetchAllTaskList = (query) => {
  return request({
    url: '/AirlineTaskAction/getAllTaskList.do',
    method: 'get',
    params: query
  })
}
/** 获取任务下条目列表 */
const fetchTaskItems = (query) => {
  return request({
    url: '/AirlineTaskAction/getJcList.do',
    method: 'get',
    params: query
  })
}
/** 统计当前用户任务情况 */
const fetchMyTaskInfo = (userInfo) => {
  return request({
    url: '/AirlineTaskAction/fetchMyTaskInfoNew.do',
    method: 'get',
    params: userInfo
  })
}
/** 获取条目的详细信息 */
const fetchTaskInfo = (query) => {
  return request({
    url: '/AirlineTaskAction/getTaskInfo.do',
    method: 'get',
    params: query
  })
}
/** 获取任务分配信息 */
const fetchTaskAssignInfo = (query) => {
  return request({
    url: '/AirlineTaskAction/getTaskAssignInfo.do',
    method: 'get',
    params: query
  })
}
/** 任务操作 */
const taskOperation = (query) => {
  return request({
    url: '/AirlineTaskAction/taskOperation.do',
    method: 'get',
    params: query
  })
}
/** 分配任务操作 */
const assignTaskOperation = (query) => {
  return request({
    url: '/AirlineTaskAction/assignTaskOperation.do',
    method: 'get',
    params: query
  })
}
/** 任务操作 */
const itemOperation = (query) => {
  return request({
    url: '/AirlineTaskAction/itemOperation.do',
    method: 'get',
    params: query
  })
}
/** 交班工作 */
const shiftWork = (data) => {
  return request({
    url: '/AirlineTaskAction/shiftWork.do',
    method: 'post',
    data
  })
}

const releaseFlight = (query) => {
  return request({
    url: '/AirlineTaskAction/releaseFlight.do',
    method: 'get',
    params: query
  })
}

const onSpotLocation = (query) => {
  return request({
    url: '/AirlineTaskAction/onSpotLocation.do',
    method: 'get',
    params: query
  })
}

const getJcData = (query) => {
  return request({
    url: '/AirlineTaskAction/getJcData.do',
    method: 'get',
    params: query
  })
}

const getShiftTaskList = (query) => {
  return request({
    url: '/AirlineTaskAction/getShiftTaskList.do',
    method: 'get',
    params: query
  })
}

const delayJcTask = (data) => {
  return request({
    url: '/AirlineTaskAction/delayJcTask.do',
    method: 'post',
    data
  })
}

const packageHxJc = (query) => {
  return request({
    url: '/JC_Tdms_OptAction/packageHxJc.do',
    method: 'get',
    params: query
  })
}

const closeTaskNotice = (query) => {
  return request({
    url: '/AirlineTaskAction/closeTaskNotice.do',
    method: 'get',
    params: query
  })
}

const getReleaseInfo = (query) => {
  return request({
    url: '/AirlineTaskAction/getUnfinishInfo.do',
    method: 'get',
    params: query
  })
}

const downloadData = (query) => {
  return request({
    url: '/AirlineTaskAction/downloadData.do',
    method: 'get',
    params: query
  })
}

const uploadData = (data) => {
  return request({
    url: '/AirlineTaskAction/uploadData.do',
    method: 'post',
    data
  })
}

export { uploadData, downloadData, fetchMyTaskList, fetchAllTaskList, fetchTaskItems, fetchMyTaskInfo, fetchTaskInfo, fetchTaskAssignInfo, taskOperation, shiftWork, releaseFlight, onSpotLocation, getJcData, itemOperation, getShiftTaskList, delayJcTask, packageHxJc, closeTaskNotice, assignTaskOperation, getReleaseInfo }
