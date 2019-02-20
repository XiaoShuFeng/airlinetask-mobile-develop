import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 25

const JcList = []
const jcCount = 5

for (let j = 0; j < jcCount; j++) {
  JcList.push(Mock.mock({
    id: '@increment',
    jcNumber: 'JCNO-@integer(1000,9999)',
    'jcType|1': ['Routine', 'NRC', 'Additional'],
    'jcStatus|1': ['UnAccept', 'Accept', 'On-Spot', 'On-Work', 'Finished'],
    jcDesc: '@title(8, 10)'
  }))
}

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    'acType|1': ['B737', 'A320', 'B747', 'B787', 'A330'],
    release: '@first',
    mechinaist: '@first',
    service: '@first',
    stateRemark: '@title(5, 10)',
    remark: '@title(8, 10)',
    flightNo: 'CA-@integer(1000,9999)',
    acReg: 'B-@integer(1000,9999)',
    'taskType|1': ['AF', 'PF', 'T', 'WK'],
    'status|1': ['UnAccept', 'Accept', 'On-Spot', 'On-Work'],
    arriveTime: '@time',
    leaveTime: '@time',
    taskState: '@title(8, 10)',
    thirdParty: '@boolean'
  }))
}

const myTask = Mock.mock({
  'unAccept': '@integer(10,99)',
  'accept': '@integer(10,99)',
  'onSpot': '@integer(10,99)',
  'onWork': '@integer(10,99)',
  'finished': '@integer(100,999)'
})

export default {
  getMyTaskList: config => {
    const { flightNo, acReg, page = 1, limit = 10 } = param2Obj(config.url)
    const mockList = List.filter(item => {
      if (flightNo && item.flightNo.indexOf(flightNo) < 0) return false
      if (acReg && item.acReg.indexOf(acReg) < 0) return false
      return true
    })

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      total: mockList.length,
      items: pageList
    }
  },
  getMyTask: config => {
    return myTask
  },
  getItemsList: config => {
    return {
      items: JcList
    }
  }
}
