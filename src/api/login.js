import request from '@/utils/request'
/** 登录 */
const loginByUsername = (query) => {
  return request({
    url: '/LoginAction/Login.do',
    method: 'get',
    params: query
  })
}
/** 登出 */
const logoutByUsername = (query) => {
  return request({
    url: '/LoginAction/Logout.do',
    method: 'get',
    params: query
  })
}

export { loginByUsername, logoutByUsername }
