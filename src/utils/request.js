import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'
const baseURL = 'http://172.20.4.189:8080'//基本的url地址，对于不同的请求在后面加上不同的后缀即可
const useStore = useUserStore()
const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const useStore = useUserStore()
    if (useStore.token) {
      config.headers.Authorization = useStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器：接受到响应之后会执行一些操作，处理业务失败或者其他错误
instance.interceptors.response.use(
  (res) => {
    // TODO 4. 摘取核心响应数据
    console.log(res)
    console.log('1111111111111')
    if (res.data.msg =='success') //成功响应
    {
      console.log('------------------')
      console.log(res.data)
        const id=res.data.data.id
        console.log(id)
      return res
    }
    // TODO 3. 处理业务失败
    // 处理业务失败, 给错误提示，抛出错误
    ElMessage.error(res.data.msg || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    // TODO 5. 处理401错误
    // 错误的特殊情况 => 401 权限不足 或 token 过期 => 拦截到登录
    if (err.response?.status === 401) {
      router.push('/login')
    }

    // 错误的默认情况 => 只要给提示
    ElMessage.error(err.response.data.message || '服务异常')
    return Promise.reject(err)
  }
)

export default instance//将配置好的axios暴露
export { baseURL }//暴露根目录
