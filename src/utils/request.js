import axios from 'axios'
import { showAlertAuto } from './index'
import router from '../router'

const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 300000,
  withCredentials: true
})

service.interceptors.request.use(config => {
  config.url = config.url + '?REQ=XJSON'
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

service.interceptors.response.use(
  response => {
    if (response.data.errorid === 'S000001') {
      showAlertAuto('提示', '登录超时，请重新登录')
      router.push('/login')
    } else {
      return response
    }
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

export default service
