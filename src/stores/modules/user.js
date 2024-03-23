//引入相应的模块
import {defineStore} from 'pinia'
import {ref} from 'vue'
export const useUserStore=defineStore('big-user',()=>{
  //定义存储在仓库中的变量以及处理变量的相应的函数
  const token=ref('')//存储token
  const username=ref('')//用户名
  const userid=ref('')//用户id
  //设置用户名
  const setUsername=(newusername)=>{
    username.value=newusername
  }
  //得到用户名
  const getUsername=()=>{
    return username.value
  }
  //移除用户名
  const removeUsername=()=>{
    username.value=''
    // return username.value
  }
  //设置token
  const setToken=(newToken)=>{
token.value=newToken
  }
  //移除token
  const removeToken=()=>{
    token.value=''
  }
  //设置用户id
  const setId=(newId)=>{
    userid.value=newId
  }
  //移除用户id
  const removeId=()=>{
    userid.value=''
  }
  return {
    token,
    setToken,
    removeToken,
    userid,
    setId,
    removeId,
    username,
    setUsername,
    getUsername,
    removeUsername
  }
  
},
{
  persist:true//添加持久化
})