import Mock from 'mockjs'
import taskAPI from './task'
import matAPI from './mat'

Mock.setup({
  timeout: '600- 1000'
})

// 任务相关
Mock.mock(/\/task\/getMyTaskList/, 'get', taskAPI.getMyTaskList)
Mock.mock(/\/task\/getMyTask/, 'get', taskAPI.getMyTask)
Mock.mock(/\/task\/getItemsList/, 'get', taskAPI.getItemsList)

// 航材相关
Mock.mock(/\/mat\/getMatListByPN/, 'get', matAPI.getMatListByPN)

export default Mock
