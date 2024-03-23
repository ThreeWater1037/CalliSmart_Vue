import request from '@/utils/request'//封装api
//封装的注册请求的函数
export const userRegisterService = ({username,password})=>request.post('/reg',{username,password})
//封装的登录请求的函数
export const userLoginService = ({username,password})=>request.post('/login',{username,password})