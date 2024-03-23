//引入相应的处理模块：
//关于路由router的处理模块
import { createRouter, createWebHistory } from 'vue-router'
//引入使用pinia仓库管理模块
import {useUserStore} from '@/stores'
//在router模块中配置相应的路由规则
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [//路由规则配置
  //登录、注册页面路由
    {path:'/login',component:()=>import( '@/views/login/LoginPage.vue')},
    //历史记录详情模块
    {path:'/calli/detail',component:()=>import('@/views/calli/HistoryDetail.vue')},
    //架子页面
    {
      path:'/',
      component:()=>import('@/views/layout/LayoutContainer.vue'),//访问到架子时进行重定向到分析页面
      redirect:'/calli/analyse',//后面进行设置，analyse为分析页面
      children:[
        //下设子路由
        {
          path:'/calli/analyse',//设置分析页面
          component:()=>import('@/views/calli/CalliAnalyse.vue'),
        },
        {
          path:'/calli/history',//设置历史记录页面
          name:'history',
          meta: {
            keepAlive:true
          },
          component:()=>import('@/views/calli/CalliHistory.vue'),
        },
        {
          path:'/calli/usermsg',//配置用户信息页面
          component:()=>import('@/views/user/UserMsg.vue'),
        },
      ]
    },
  
  ]
})
// 拦截设置，需要先登录才能访问其他页面
router.beforeEach((to) => {
  const useStore=useUserStore()
  if(!useStore.token&&to.path!=='/login'){
    return '/login'
  }
})
//导出
export default router
