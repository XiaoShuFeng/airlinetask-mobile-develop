import request from '@/utils/request'

const fetchListByPN = (query) => {
  return request({
    url: '/AirlineTaskAction/searchMatList.do',
    method: 'get',
    params: query
  })
}

export { fetchListByPN }
