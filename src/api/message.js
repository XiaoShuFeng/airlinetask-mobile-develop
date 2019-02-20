import request from '@/utils/request'

const fetchMsgList = (query) => {
  return request({
    url: '/AirlineTaskAction/getMsgList.do',
    method: 'get',
    params: query
  })
}

const setMsgRead = (query) => {
  return request({
    url: '/AirlineTaskAction/setMsgRead.do',
    method: 'get',
    params: query
  })
}

const getMsgCount = (query) => {
  return request({
    url: '/AirlineTaskAction/getMsgCount.do',
    method: 'get',
    params: query
  })
}

export { fetchMsgList, setMsgRead, getMsgCount }
