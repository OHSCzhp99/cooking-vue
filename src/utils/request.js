import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '../router'

//基础地址(不写http://localhost:8080 可解决跨域问题)
//在vite.config.js中改的
const baseURL = '/api' 

const instance = axios.create({
  baseURL,
  timeout: 10000
})

//请求拦截器
instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore() //用仓库
    if (userStore.token) {
      //如果携带token则在加在请求头上
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

//响应拦截器
instance.interceptors.response.use(
  (res) => {
    //处理业务成功 状态码为 0
    if (res.data.code === 0) {
      return res.data
    }
    //处理业务失败 给错误提示，抛出错误
    ElMessage.error(res.data.message || '服务异常') //利用elementPlus弹窗给出错误提示
    return Promise.reject(res.data)
  },
  (err) => {
    //处理错误：401权限不足 或者 token过期 --> 拦截到登录页
    if (err.response?.status === 401) {
      router.push('/login')
    }

    //错误的默认情况 - 只给提示
    ElMessage.error(err.response.data.message || '服务异常')
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
